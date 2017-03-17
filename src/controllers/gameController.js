import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {transferFactory} from './../servises/transferFactory'
import {defaultPositions} from './../constants/defaultPositions';
import {spritesStore} from './../spritesStore';

import {_hf} from './../servises/helpFunctions';
import {betStore} from './../servises/betStore';

// Components
import Background           from './../components/background/background';
import GameFieldController  from './../components/gameField/gameFieldController';
import ButtonController     from './../components/button/buttonController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';
import BetController        from './../components/bet/betController';


export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
		console.log('init GameController');
		let game = this.game,
			stage = game.stage;

		this.stage = stage;

		/**
		 * background
		 */
		let bg = new Background();
		stage.addChild(bg);

		stage.interactive = true;

		['mousemove', 'touchmove', 'pointermove'].forEach((event)=>{
			stage.on(event, this.onTouchMove, this);
		});

		// ['touchend', 'mouseup', 'pointerup'].forEach((event)=>{
		// 	stage.on(event, this.setBet, this);
		// });

		/**
		 * Игровое поле
		 */
		this.gameField = new GameFieldController({
			onClickCb: this.setBet,
			ctx: this
		});
		stage.addChild(this.gameField.gameFieldSprite);

		/**
		 * Прогружаем все json-атласы
		 */
		assetLoader(()=>{
			let chipsController = new ChipController();
			for(let key in chipsController.chips){
				stage.addChild(chipsController.chips[key].sprite);
			}

			let buttonsController = new ButtonController();
			buttonsController.buttons.forEach((button)=>{
				stage.addChild(button);
			});

			this.floatChipContainer = new FloatChipController({
				onTouchEndCb: this.setBet,
				ctx: this
			});
			stage.addChild(this.floatChipContainer.getFloatChipsSprite);

			game.start();
		});
	};

	onTouchMove(event){
		if(transferFactory.activeChip && !transferFactory.betTouchStart){
			this.floatChipContainer.viewFloatChip(transferFactory.activeChip.value);
			this.floatChipContainer.setPosition( event.data.global );
		} else if(transferFactory.betTouchStart){
			let pos4Bet = this.getPosForBet(event.data.global, true);
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;

			let value = betStore[betStoreId].getTopChipValue();

			betStore[betStoreId].updateBetView(-value);
			transferFactory.betTouchStart = false;
			transferFactory.activeChip = {
				value: value
			}
		}
	}

	/**
	 * Эта функция является коллбеков, который вызывается по событию touchEnd у компонента bet
	 * (betView.touchEnd -> betCtrl.touchEnd -> onTouchEnd)
	 * Описание:
	 * Функция определяет, было ли событие touchEnd совершено над игровым полем.
	 * Если да, то вычисляем координаты и создаём новый экземпляр компонента Bet с данными координатами
	 * (возвращаемые координаты являются локальными для игрового поля, т.е. комп. gameField)
	 *
	 * Проверка существующей ставки:
	 * После того как пришли координаты для комп Bet, создаём объект, в котором ключём будут
	 * являться наши координаты, а значением - экземпляр контроллера комп Bet. Когда в следующий
	 * раз мы получим эти же координаты, то проверим, существует ли по ним контроллер. Если да,
	 * то просто вызываем в нём функцию update
	 *
	 * @param event
	 */
	setBet(event){
		let pos4Bet = this.getPosForBet(event.data.global, true);

		if(pos4Bet && (transferFactory.activeChip || transferFactory.lastChip)){
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;
			let currentValue = (transferFactory.activeChip) ?
				transferFactory.activeChip.value :
				transferFactory.lastChip.value;

			if(betStore[betStoreId]){
				betStore[betStoreId].updateBetView(currentValue);
			} else {
				let configForBetCtrl = {
					pos: pos4Bet,
					value: currentValue,
					onTouchEndCb: this.setBet,
					onTouchStartCb: this.onTouchMove,
					ctx: this
				};

				let betController = new BetController(configForBetCtrl);
				this.stage.addChild(betController.betSprite);
				betStore[betStoreId] = betController;
			}
		}

		this.clearTableBet();
	}

	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
		transferFactory.activeChip = undefined;
 		this.floatChipContainer.hideFloatChip();
		this.gameField.hideHints();
	};

	getPosForBet(pos, global){
		return this.gameField.getPosForBet(pos, global);
	}
}