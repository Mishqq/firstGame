import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {transferFactory} from './../servises/transferFactory'

import {betModel} from '../servises/betStoreModule';

// Components
import Background           from './../components/background/background';
import GameFieldController  from './../components/gameField/gameFieldController';
import ButtonController     from '../components/button/buttonPanelController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';
import BetController        from './../components/bet/betController';


export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
		let game = this.game,
			stage = game.stage;

		this.stage = stage;


		this.betModel = betModel;

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


			// Панель кнопок
			let buttonsController = new ButtonController({
				cancelCb: this.btnPanelCancelCb,
				clearCb: this.btnPanelClearCb,
				repeatCb: this.btnPanelRepeatCb,
				x2Cb: this.btnPanelX2Cb,
				ctx: this
			});
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
		let fChip = this.floatChipContainer,
			betsCtrl = this.betModel.betsCtrl,
			_tf = transferFactory;

		// TODO: по-хорошему надо реализовать событийную модель

		if(_tf.activeChip && !_tf.betTouchStart){
			// Если у нас есть активный тип ставки и если тачстарт начался не на существующей ставке
			fChip.viewFloatChip(_tf.activeChip.value);
			fChip.setPosition( event.data.global );

		} else if(_tf.betTouchStart){
			// Если тачстарт начался с существующей ставки
			let pos4Bet = this.getPosForBet(event.data.global, true);
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;

			let value = betsCtrl[betStoreId].getTopChipValue();

			betsCtrl[betStoreId].updateBetView(-value);
			_tf.betTouchStart = false;
			_tf.activeChip = {
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
		let pos4Bet = this.getPosForBet(event.data.global, true),
			betsCtrl = this.betModel.betsCtrl,
			_tf = transferFactory;

		if(pos4Bet && (_tf.activeChip || _tf.lastChip)){
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;
			let currentValue = (_tf.activeChip) ?
				_tf.activeChip.value :
				_tf.lastChip.value;

			if(betsCtrl[betStoreId]){
				betsCtrl[betStoreId].updateBetView(currentValue);
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
				betsCtrl[betStoreId] = betController;
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


	/**
	 * Синхронизируем изменение вьюхи и коллекцию ставок
	 * (не коллекцию контроллеров компонентов ставок)
	 */
	updateBetModel(){
		// TODO: пробежаться по коллекции контроллеров в модели
		// ставок и апнуть коллекцию ставок, а затем апнуть общую ставку
	}




	/**
	 * ===========================   buttonPanel click callbacks  ================================
	 */

	btnPanelCancelCb(){
		console.log('cancelClick (gameController)');
	}

	btnPanelClearCb(){
		console.log('clearClick (gameController)');
	}

	btnPanelRepeatCb(){
		console.log('repeatClick (gameController)');
	}

	btnPanelX2Cb(){
		console.log('x2Click (gameController)');
	}
}