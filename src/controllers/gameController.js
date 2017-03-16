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

		// ['mouseup', 'touchend', 'pointerup'].forEach((event)=>{
		// 	stage.on(event, this.onTouchEnd, this);
		// });

		/**
		 * Игровое поле
		 */
		this.gameField = new GameFieldController();
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
				onTouchEndCb: this.onTouchEnd,
				ctx: this
			});
			stage.addChild(this.floatChipContainer.getFloatChipsSprite);

			game.start();
		});
	};

	onTouchMove(event){
		if(transferFactory.activeChip){
			this.floatChipContainer.viewFloatChip(transferFactory.activeChip.value);
			this.floatChipContainer.setPosition( event.data.global );
		}
	}

	onTouchEnd(event){
		let gameFieldPos = this.gameField.gameFieldSprite.getBounds(),
			pos = event.data.global;


		/////////////////////////////////////

		// TODO: сделать описание как это работает

		if(_hf.isPosInBounds(pos, gameFieldPos) && transferFactory.activeChip){
			let pos4Bet = this.getCoordsForBet({
				x: pos.x - gameFieldPos.x,
				y: pos.y - gameFieldPos.y
			});

			if(pos4Bet){
				let betStoreId = pos4Bet.x + '_' +pos4Bet.y;

				if(betStore[betStoreId]){
					console.log('Апдейтим ставку');
					betStore[betStoreId].updateBetView(transferFactory.activeChip.value);
				} else {
					console.log('Создаём новую ставку');

					let betController = new BetController({
						pos: {x: pos4Bet.x + gameFieldPos.x, y: pos4Bet.y + gameFieldPos.y},
						value: transferFactory.activeChip.value,
						onTouchEndCb: this.onTouchEnd,
						ctx: this
					});

					this.stage.addChild(betController.betSprite);
					betStore[betStoreId] = betController;
				}
			}
		}

		///////////////////////////////////////////////////


		// Если отпустили ставку над столом - то проводим её
		// if(_hf.isPosInBounds(pos, gameFieldPos) && transferFactory.activeChip){
		// 	let pos4Bet = this.getCoordsForBet({
		// 		x: pos.x - gameFieldPos.x,
		// 		y: pos.y - gameFieldPos.y
		// 	});
		//
		// 	if(pos4Bet){
		// 		this.setBet({
		// 			x: pos4Bet.x + gameFieldPos.x,
		// 			y: pos4Bet.y + gameFieldPos.y
		// 		}, transferFactory.activeChip.value);
		// 	}
		// }

		this.clearTableBet();
	}

	/**
	 * Функция ставки.
	 * @param pos - {x, y} - позиция события
	 * @param value - Num Величина ставки
	 */
	setBet(pos, value){
		let betStoreId = pos.x + '_' +pos.y;

		if(betStore[betStoreId]){
			betStore[betStoreId].updateBetView(value);
		} else {
			console.log('Создаём новую ставку');
			let betController = new BetController(pos, value);
			this.stage.addChild(betController.betSprite);
			betStore[betStoreId] = betController;
		}
	};

	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
		transferFactory.activeChip = undefined;
 		this.floatChipContainer.hideFloatChip();
		this.gameField.hideHints();
	};

	getCoordsForBet(pos){
		return this.gameField.getCoordsForBet(pos);
	}
}