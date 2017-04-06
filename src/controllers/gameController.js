import PIXI from 'pixi.js';
import plugins from './../plugins';
import Game from './../Game';
import assetLoader from './../assetsLoader'
import presets from './../constants/presets'

import GameStore from '../servises/gameStore';
import {_hf} from '../servises/helpFunctions';

// Components
import Background           from './../components/background/background';
import GameFieldController  from './../components/gameField/gameFieldController';
import ButtonController     from '../components/button/buttonPanelController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';
import BetController        from './../components/bet/betController';
import TimeScaleController  from './../components/timeScale/timeScaleController';
import infoPanelController  from './../components/infoPanel/infoPanelController';
import betPanelController   from './../components/betPanel/betPanelController';
import historyController    from './../components/history/historyController';

/**
 * Плохо оно само получится ©
 */
export default class GameController {
	constructor(){
		this.game = new Game(presets.settings.game);
	}

	init(){
		// Component controller instances collection
		this._cmpCtrls = {};

		let game = this.game,
			stage = game.stage;

		this.gameStore = new GameStore({
			balance: presets.data.betPanel.fldBalance
		});

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

		// Игровое поле
		this._cmpCtrls.gameField = new GameFieldController({setBet: this.setBet, checkChips: this.checkChips, ctx: this});


		// Прогружаем все json-атласы
		assetLoader(()=>{
			let chipsController = new ChipController({click: this.chipClick, touchStart: this.chipTouchStart, ctx: this});
			this.chipsController = chipsController;

			for(let key in chipsController.chips)
				stage.addChild(chipsController.chips[key].sprite);

			// Панель кнопок
			let buttonsController = new ButtonController({
				cancel: this.btnCancel,
				clear: this.btnClear,
				repeat: this.btnRepeat,
				x2: this.btnX2,
				ctx: this
			});
			this.buttonsController = buttonsController;
			buttonsController.buttons.forEach((button)=>{
				stage.addChild(button);
			});

			// Плавающая фишка
			this._cmpCtrls.fChip = new FloatChipController({setBet: this.setBet, ctx: this});

			// Шкала-таймер
			this._cmpCtrls.timeScale = new TimeScaleController({lockTable:this.lockTable, ctx: this});
			this._cmpCtrls.timeScale.start();

			// Панель с информацией о лимитах, горячих/холодных номерах
			this._cmpCtrls.infoPanel = new infoPanelController(presets.data.infoPanel);

			// Панель с информацией о выигрыше/ставке/балансе
			this._cmpCtrls.betPanelCtrl = new betPanelController(presets.data.betPanel);

			// Панель с рулеткой и лентой истории
			this._cmpCtrls.historyCtrl = new historyController(
				presets.settings.history, {rollCb: this.rollNumber, ctx: this}
			);


			for(let key in this._cmpCtrls)
				stage.addChild(this._cmpCtrls[key].pixiSprite);


			game.start();
		});
	};

	restartGame(){
		this.gameStore.activeChip = undefined;
		this.gameStore.betTouchStart = false;

		// Прописываем новый баланс. Добавляем в историю номер предыдущего розыгрыша

		this._cmpCtrls.betPanelCtrl.updateInfoPanelView({fldBet: 0});

		this.stage.interactive = true;

		this.chipsController.enablePanel();
		this.buttonsController.enablePanel();
		this._cmpCtrls.gameField.enableField();

		for(let key in this.gameStore.betsCtrl)
			this.gameStore.betsCtrl[key].enableMove();

		this._cmpCtrls.timeScale.start();

		this._cmpCtrls.historyCtrl.play();
	}

	onTouchMove(event){
		let fChip = this._cmpCtrls.fChip,
			betsCtrl = this.gameStore.betsCtrl;

		if( this.gameStore.activeChip && !this.gameStore.betTouchStart ){
			// Если у нас есть активный тип ставки и если тачстарт начался не на существующей ставке
			fChip.viewFloatChip(this.gameStore.activeChip.value);
			fChip.setPosition( event.data.global );

		} else if( this.gameStore.betTouchStart ){
			// Если тачстарт начался с существующей ставки
			let pos4Bet = this.getDataForBet(event.data.global, true);
			let betStoreId = pos4Bet.center.x + '_' +pos4Bet.center.y;

			let value = betsCtrl[betStoreId].getTopChipValue();

			betsCtrl[betStoreId].updateBetView(-value);
			this.gameStore.activeChip = {value: value};

			this.gameStore.betTouchStart = false;
		}
	}

	betTouchStart(){
		this.gameStore.betTouchStart = true;
	}

	/**
	 * Эта функция является коллбеком, который вызывается по событию touchEnd у компонента bet
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
		this.gameStore.betTouchStart = false;

		let pos4Bet = this.getDataForBet(event.data.global, true),
			chip = this.gameStore.activeChip;

		if(!chip && this.chipsController.getActiveChip()) chip = this.chipsController.getActiveChip().chipData();

		if(pos4Bet && chip){
			if( _hf.getClass(pos4Bet) === 'array' ){
				pos4Bet.forEach((item) => {
					this.createUpdateBet(item);
				});
			} else {
				this.createUpdateBet(pos4Bet);
			}
		}

		this.gameStore.activeChip = undefined;

		this.clearTableBet();
		this.updateBetModel();
	}

	/**
	 * Работает, не трогать
	 * @param pos4Bet
	 */
	createUpdateBet(pos4Bet){
		let betsCtrl = this.gameStore.betsCtrl,
			chip = this.gameStore.activeChip;

		// Костылим короч
		let _ch = this.chipsController.getActiveChip();
		if(!chip) chip = {value: _ch.chipValue, type: _ch.chipType};

		let betStoreId = pos4Bet.center.x + '_' +pos4Bet.center.y;
		let currentValue = chip.value;

		if(betsCtrl[betStoreId]){
			betsCtrl[betStoreId].updateBetView(currentValue);
		} else {
			let configForBetCtrl = {
				pos: pos4Bet.center, type: pos4Bet.numbers, value: currentValue, limits: presets.limits,
				setBet: this.setBet,
				touchStart: this.betTouchStart,
				delBet: this.deleteBet,
				ctx: this};

			let betController = new BetController(configForBetCtrl);
			this.stage.addChild(betController.betSprite);

			betsCtrl[betStoreId] = betController;
		}
	}

	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
 		this._cmpCtrls.fChip.hideFloatChip();
		this._cmpCtrls.gameField.hideHints();
	};

	getDataForBet(pos, global){
		return this._cmpCtrls.gameField.getDataForBet(pos, global);
	}

	deleteBet(betCtrl){
		for(let ctrl in this.gameStore.betsCtrl){
			if(this.gameStore.betsCtrl[ctrl] === betCtrl) delete this.gameStore.betsCtrl[ctrl];
		}
	};


	/**
	 * Синхронизируем изменение вьюхи и коллекцию ставок
	 * (не коллекцию контроллеров компонентов ставок)
	 */
	updateBetModel(){
		let bet = 0;
		for(let key in this.gameStore.betsCtrl)
			bet += this.gameStore.betsCtrl[key].balance;

		this._cmpCtrls.betPanelCtrl.updateInfoPanelView({fldBet: bet});
	}


	/**
	 * Метод лочит панель фишек и кнопок по истечению времени
	 */
	lockTable(){
		console.log('Вызываем методы блокировки фишек и кнопок ➠ ');
		this.clearTableBet();

		this.stage.interactive = false;

		this.chipsController.disablePanel();
		this.buttonsController.disablePanel();
		this._cmpCtrls.gameField.disableField();

		for(let key in this.gameStore.betsCtrl)
			this.gameStore.betsCtrl[key].disableMove();

		setTimeout(() => {
			for(let key in this.gameStore.betsCtrl)
				this.gameStore.betsCtrl[key].clearBet();
		}, 2000);

		setTimeout(() => {
			this.btnClear();

			this.restartGame();
		}, presets.settings.timeScale.viewResTime * 1000)
	}

	/**
	 * Крутим рулетку
	 * @param number
	 */
	rollNumber(number){
		this._cmpCtrls.gameField.showWinNum(number);

		// Рассчет выигрыша
		let win = this.calculateWin(number);

		setTimeout(() => {
			if(win) this._cmpCtrls.betPanelCtrl.updateInfoPanelView({fldWin: win});

			this._cmpCtrls.gameField.hideWinNum();
		}, 3000)
	}

	/**
	 * Рассчёт выигрыша
	 */
	calculateWin(winNum){
		let betsCtrl = this.gameStore.betsCtrl,
			_k = presets.coefficients;

		let win = 0;

		for(let key in betsCtrl){
			let bet = betsCtrl[key],
				num = bet.numbers, type = num.length, val = bet.balance;

			if(~bet.numbers.indexOf(winNum)) win+= val * _k[type];
		}

		return win;
	}


	/**
	 * ===========================   chips click callbacks  ================================
	 */

	chipClick(chip){
		this.gameStore.activeChip = chip;
	}

	chipTouchStart(chip){
		this.gameStore.activeChip = chip;
	}

	checkChips(){
		return this.gameStore.activeChip
	}


	/**
	 * ===========================   buttonPanel click callbacks  ================================
	 */

	btnCancel(){
		console.log('cancelClick (gameController)');
	}

	btnClear(){
		for(let key in this.gameStore.betsCtrl){
			let ctrl = this.gameStore.betsCtrl[key];
			ctrl.betSprite.removeChildren();

			this.stage.removeChild(ctrl.betSprite);

			delete this.gameStore.betsCtrl[key];
		}
	}

	btnRepeat(){
		console.log('repeatClick (gameController)');
	}

	btnX2(){
		for(let key in this.gameStore.betsCtrl){
			let ctrl = this.gameStore.betsCtrl[key],
				value = ctrl.balance;

			ctrl.updateBetView(value);
		}
	}
}