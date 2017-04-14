import plugins from './../plugins';
import Game from './../Game';
import {assetLoader} from '../services/resourseLoader'
import presets from './../constants/presets'

import GameStore from '../services/gameStore';
import {_hf} from '../services/helpFunctions';

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
import betButtonController  from './../components/betButton/betButtonController';
import historyController    from './../components/history/historyController';

/**
 * Плохо оно само получится ©
 */
export default class GameController {
	constructor(fromJs){
		this.fromJs = fromJs;

		this.game = new Game(presets.settings.game);
	}

	init(initConfig){
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
			this._cmpCtrls.chips = new ChipController({click: this.chipClick, touchStart: this.chipTouchStart, ctx: this});

			// Панель кнопок
			let buttonsController = new ButtonController({
				// btnCancel: this.btnCancel,
				btnClear: this.btnClear,
				btnRepeat: this.btnRepeat,
				btnX2: this.btnX2,
				ctx: this
			});
			this._cmpCtrls.buttons = buttonsController;

			// Плавающая фишка
			this._cmpCtrls.betBtn = new betButtonController({betBtnClick: this.betBtnClick, ctx: this});

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
		}, this);
	};

	restartGame(){
		let _gs = this.gameStore,
			_cfb = _gs.confirmBets;

		_gs.activeChip = undefined;
		_gs.betTouchStart = false;
		_cfb.length = 0;

		// Прописываем новый баланс. Добавляем в историю номер предыдущего розыгрыша

		this._cmpCtrls.betPanelCtrl.updateInfoPanelView({fldBet: 0});

		this.interactiveSwitcher(true);

		this._cmpCtrls.timeScale.start();
		this._cmpCtrls.historyCtrl.play();
	};




	/**
	 * ==================================== Методы работы с моделью и данными =======================================
	 */
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

		if(!chip && this._cmpCtrls.chips.getActiveChip()){
			chip = this._cmpCtrls.chips.chipData( this._cmpCtrls.chips.getActiveChip() );
		}

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
	};

	/**
	 * Работает, не трогать
	 * @param pos4Bet
	 */
	createUpdateBet(pos4Bet){
		let betsCtrl = this.gameStore.betsCtrl,
			chip = this.gameStore.activeChip;

		// Костылим короч
		let _ch = this._cmpCtrls.chips.getActiveChip();
		if(!chip) chip = {value: _ch._chipValue, type: _ch._chipType};

		let betStoreId = pos4Bet.center.x + '_' +pos4Bet.center.y;
		let currentValue = chip.value;

		if(betsCtrl[betStoreId]){
			betsCtrl[betStoreId].updateBetView(currentValue);
		} else {
			let configForBetCtrl = {
				pos: pos4Bet.center, numbers: pos4Bet.numbers, value: currentValue,
				limits: presets.limits, type: pos4Bet.type,
				setBet: this.setBet,
				touchStart: this.betTouchStart,
				delBet: this.deleteBet,
				ctx: this};

			if(pos4Bet.dozen) configForBetCtrl.dozen = pos4Bet.dozen;
			if(pos4Bet.column) configForBetCtrl.column = pos4Bet.column;

			let betController = new BetController(configForBetCtrl);
			this.stage.addChild(betController.betSprite);

			betsCtrl[betStoreId] = betController;
		}
	};

	/**
	 * Метод возвращает объект с координатами для ставки
	 * @param pos
	 * @param global - использовать глобальный координаты или координаты игрового поля (true | false)
	 * @returns {x|y}
	 */
	getDataForBet(pos, global){
		return this._cmpCtrls.gameField.getDataForBet(pos, global);
	};

	/**
	 * Удаление ставки (удаление контроллера в коллекции)
	 * @param betCtrl
	 */
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
	};

	/**
	 * Рассчёт выигрыша
	 */
	calculateWin(winNum){
		let _gs = this.gameStore,
			_cfb = _gs.confirmBets,
			_k = presets.coefficients;

		let win = 0;

		_cfb.forEach((item) => {
			if(~item.numbers.indexOf(winNum)) win+= item.balance * _k[ item.numbers.length ];
		});

		return win;
	};

	/**
	 * Генератор сообщения о ставках для fromJs
	 */
	fromJsMag(){
		let _gs = this.gameStore, _cfb = _gs.confirmBets;

		let msg = {kind: 'bets_msg', bets: []};
		_cfb.forEach((item) => {
			let obj = {price: item.balance, content: {kind: item.type}};

			if(item.type === 'dozen' || item.type === 'column') {
				obj.content[item.type] = item[item.type];
			} else if(item.type === 'numbers'){
				obj.content.numbers = item.numbers;
			}
			msg.bets.push(obj)
		});

		return JSON.stringify(msg);
	}




	/**
	 * ========================================== Управление игровым столом =========================================
	 */
	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
		this._cmpCtrls.fChip.hideFloatChip();
		this._cmpCtrls.gameField.hideHints();
	};

	/**
	 * Метод лочит панель фишек и кнопок по истечению времени
	 */
	lockTable(){
		this.clearTableBet();

		this.interactiveSwitcher(false);

		setTimeout(() => {
			for(let key in this.gameStore.betsCtrl){
				this.gameStore.betsCtrl[key].clearBet();
				presets.gameSounds.play('sound03');
			}
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
		if(win) presets.gameSounds.play('sound06');

		setTimeout(() => {
			if(win) this._cmpCtrls.betPanelCtrl.updateInfoPanelView({fldWin: win});

			this._cmpCtrls.gameField.hideWinNum();
		}, 3000)
	}




	/**
	 * ===========================   Интерактивные события  ================================
	 */
	/**
	 * событие touchmove по всей сцене
	 * @param event
	 */
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
	};

	/**
	 * Тачстарт начался с существующей ставки
	 */
	betTouchStart(){
		this.gameStore.betTouchStart = true;
	};

	/**
	 * Клик по фишке на панели фишек
	 * @param chip
	 */
	chipClick(chip){
		this.gameStore.activeChip = chip;
	};

	/**
	 * Тачстарт начался с панели фишек
	 * @param chip
	 */
	chipTouchStart(chip){
		this.gameStore.activeChip = chip;
	};

	/**
	 * Проверка на активную фишку
	 * @returns {undefined|*|{value: *}}
	 */
	checkChips(){
		return this.gameStore.activeChip
	};

	/**
	 * Событие кнопки "отменить" (передаётся коллбеком)
	 */
	btnCancel(){
		console.log('cancelClick (gameController)');
	};

	/**
	 * Событие кнопки "очистить" (передаётся коллбеком)
	 */
	btnClear(){
		for(let key in this.gameStore.betsCtrl){
			let ctrl = this.gameStore.betsCtrl[key];
			ctrl.betSprite.removeChildren();

			this.stage.removeChild(ctrl.betSprite);

			delete this.gameStore.betsCtrl[key];
		}
	};

	/**
	 * Событие кнопки "повторить ставки" (передаётся коллбеком)
	 */
	btnRepeat(){
		console.log('repeatClick (gameController)');
	};

	/**
	 * Событие кнопки "удвоить ставки" (передаётся коллбеком)
	 */
	btnX2(){
		for(let key in this.gameStore.betsCtrl){
			let ctrl = this.gameStore.betsCtrl[key],
				value = ctrl.balance;

			ctrl.updateBetView(value);
		}
	};

	/**
	 * Событие кнопки "BET" (передаётся коллбеком)
	 */
	betBtnClick(){
		let _gs = this.gameStore, _cfb = _gs.confirmBets;

		for(let key in _gs.betsCtrl){
			let bet = _gs.betsCtrl[key];

			let obj = {numbers: bet.numbers, balance: bet.balance, type: bet.type};
			if(bet.moreType) obj[bet.type] = bet.moreType;
			_cfb.push(obj);
		}

		this.clearTableBet();

		this.fromJs(this.fromJsMag());

		this.interactiveSwitcher(false);
	};

	/**
	 * Включаем / выключаем интерактивность элементов
	 * @param status
	 */
	interactiveSwitcher(status){
		status = !!status;

		this.stage.interactive = status;

		for(let key in this._cmpCtrls){
			if(this._cmpCtrls[key].disable && status) this._cmpCtrls[key].enable();
			if(this._cmpCtrls[key].disable && !status) this._cmpCtrls[key].disable();
		}

		for(let key in this.gameStore.betsCtrl){
			if(status) this.gameStore.betsCtrl[key].enableMove();
			if(!status) this.gameStore.betsCtrl[key].disableMove();
		}
	}
}