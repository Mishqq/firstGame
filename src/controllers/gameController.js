import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {_tevStore, _tev} from './../servises/touchEvents'

import {betStore} from '../servises/betStore';

// Components
import Background           from './../components/background/background';
import GameFieldController  from './../components/gameField/gameFieldController';
import ButtonController     from '../components/button/buttonPanelController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';
import BetController        from './../components/bet/betController';
import TimeScaleController  from './../components/timeScale/timeScaleController';
import infoPanelController  from './../components/infoPanel/infoPanelController';
import betPanelController  from './../components/betPanel/betPanelController';


export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
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
			this.chipsController = chipsController;
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
			this.buttonsController = buttonsController;
			buttonsController.buttons.forEach((button)=>{
				stage.addChild(button);
			});


			this.floatChipContainer = new FloatChipController({
				onTouchEndCb: this.setBet,
				ctx: this
			});
			stage.addChild(this.floatChipContainer.getFloatChipsSprite);


			this._timeScale = new TimeScaleController({
				disableCb:this.disableChipsAndButtons,
				ctx: this
			});
			stage.addChild(this._timeScale.pixiSprite);
			this._timeScale.start();
			setTimeout(() => {
				this._timeScale.pause();
			}, 1500);



			let infoPanelFishData = {
				limitsPanel: {max: 30000, min: 50},
				hotNumPanel: [
					{number: 12, amount: 1},
					{number: 'doubleZero', amount: 2},
					{number: 12, amount: 3},
					{number: 12, amount: 4}
				],
				coldNumPanel: [
					{number: 7, amount: 1},
					{number: 7, amount: 2},
					{number: 'zero', amount: 3},
					{number: 7, amount: 4}
				],
				otherNumPanel: {red: 12, black: 12, odd: 12, even: 12, zero: 12}
			};
			this.infoPanel = new infoPanelController(infoPanelFishData);
			stage.addChild(this.infoPanel.pixiSprite);


			this.betPanelCtrl = new betPanelController();
			stage.addChild(this.betPanelCtrl.pixiSprite);

			game.start();
		});
	};

	onTouchMove(event){
		let fChip = this.floatChipContainer,
			betsCtrl = betStore.betsCtrl;

		if( betStore.activeChip && !_tev.isActive(_tevStore.BET_TOUCH_START) ){
			// Если у нас есть активный тип ставки и если тачстарт начался не на существующей ставке
			fChip.viewFloatChip(betStore.activeChip.value);
			fChip.setPosition( event.data.global );

		} else if( _tev.isActive(_tevStore.BET_TOUCH_START) ){
			// Если тачстарт начался с существующей ставки
			let pos4Bet = this.getPosForBet(event.data.global, true);
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;

			let value = betsCtrl[betStoreId].getTopChipValue();

			betsCtrl[betStoreId].updateBetView(-value);
			betStore.activeChip = {value: value};

			_tev.clearEvents();
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
			betsCtrl = betStore.betsCtrl,
			chip = betStore.activeChip;

		if(!chip && this.chipsController.getActiveChip()) chip = this.chipsController.getActiveChip().chipData();

		if(pos4Bet && chip){
			let betStoreId = pos4Bet.x + '_' +pos4Bet.y;
			let currentValue = chip.value;

			if(betsCtrl[betStoreId]){
				betsCtrl[betStoreId].updateBetView(currentValue);
			} else {
				let configForBetCtrl = {
					pos: pos4Bet,
					value: currentValue,
					onTouchEndCb: this.setBet,
					onTouchStartCb: this.onTouchMove,
					deleteBetCb: this.deleteBet,
					ctx: this
				};

				let betController = new BetController(configForBetCtrl);
				this.stage.addChild(betController.betSprite);
				betsCtrl[betStoreId] = betController;
			}
		}
		betStore.activeChip = undefined;

		this.clearTableBet();

		this.updateBetModel();
	}

	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
 		this.floatChipContainer.hideFloatChip();
		this.gameField.hideHints();
	};

	getPosForBet(pos, global){
		return this.gameField.getPosForBet(pos, global);
	}

	deleteBet(betCtrl){
		for(let ctrl in betStore.betsCtrl){
			if(ctrl === betCtrl) delete betStore.betsCtrl[betCtrl];
		}
	};


	/**
	 * Синхронизируем изменение вьюхи и коллекцию ставок
	 * (не коллекцию контроллеров компонентов ставок)
	 */
	updateBetModel(){

	}


	/**
	 * Метод лочит панель фишек и кнопок по истечению времени
	 */
	disableChipsAndButtons(){
		// TODO: если в момент окончания времени есть плавающая фишка - скрывать
		console.log('Вызываем методы блокировки фишек и кнопок ➠ ');
		this.stage.interactive = false;

		this.chipsController.disablePanel();
		this.buttonsController.disablePanel();
		this.gameField.disableField();

		for(let key in betStore.betsCtrl){
			betStore.betsCtrl[key].disableMove();
		}
	}




	/**
	 * ===========================   buttonPanel click callbacks  ================================
	 */

	btnPanelCancelCb(){
		console.log('cancelClick (gameController)');
	}

	btnPanelClearCb(){
		for(let key in betStore.betsCtrl){
			let ctrl = betStore.betsCtrl[key];
			ctrl.betSprite.removeChildren();

			this.stage.removeChild(ctrl.betSprite);

			delete betStore.betsCtrl[key];
		}
	}

	btnPanelRepeatCb(){
		console.log('repeatClick (gameController)');
	}

	btnPanelX2Cb(){
		for(let key in betStore.betsCtrl){
			let ctrl = betStore.betsCtrl[key],
				value = ctrl.balance;

			ctrl.updateBetView(value);
		}
	}
}