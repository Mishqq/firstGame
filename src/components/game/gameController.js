import plugins from '../../plugins';
import Game from '../../Game';
import {assetLoader} from '../../services/resourseLoader'
import presets from '../../constants/presets'
import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';

import GameModel from './gameModel';
import {_hf} from '../../services/helpFunctions';

// Components
import Background           from '../background/background';
import GameFieldController  from '../gameField/gameFieldController';
import ButtonController     from '../button/buttonPanelController';
import ChipController       from '../chip/chipController';
import FloatChipController  from '../floatChip/floatChipController';
import BetController        from '../bet/betController';
import TimeScaleController  from '../timeScale/timeScaleController';
import infoPanelController  from '../infoPanel/infoPanelController';
import betPanelController   from '../betPanel/betPanelController';
import betButtonController  from '../betButton/betButtonController';
import historyController    from '../history/historyController';

// Сокращения для удобства
let _gm,    // gameModel
	_cmp,   // components // храним контроллеры компонентов
	_stg;   // stage


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

		this._touchEvents = {
			betStart: false,
			betEnd: false,
			chipStart: false,
			move: false
		};

		let game = this.game;
		this.stage = game.stage;

		this.gameModel = new GameModel({balance: presets.data.betPanel.fldBalance});

		_gm = this.gameModel, _cmp = this._cmpCtrls;

		 _stg = this.stage;

		/**
		 * background
		 */
		let bg = new Background();
		_stg.addChild(bg);
		_stg.interactive = true;


		presets.events.start.forEach((event)=>{ _stg.on(event, this.onTouchStart, this) });

		presets.events.move.forEach((event)=>{ _stg.on(event, this.onTouchMove, this) });

		presets.events.end.forEach((event)=>{ _stg.on(event, this.onTouchEnd, this) });


		// Игровое поле
		_cmp.gameField = new GameFieldController({checkChips: this.checkActiveChip, ctx: this});

		// Прогружаем все json-атласы
		assetLoader(()=>{
			_cmp.chips = new ChipController({touchEnd: this.chipTouchEnd, touchStart: this.chipTouchStart,ctx: this
			});

			// Панель кнопок
			let buttonsController = new ButtonController({
				// btnCancel: this.btnCancel,
				btnClear: this.btnClear,
				btnRepeat: this.btnRepeat,
				btnX2: this.btnX2,
				ctx: this
			});
			_cmp.buttons = buttonsController;

			// Плавающая фишка
			_cmp.betBtn = new betButtonController({betBtnClick: this.betBtnClick, ctx: this});

			// Плавающая фишка
			// _cmp.fChip = new FloatChipController({setBet: this.floatChipCallback, ctx: this});

			// Шкала-таймер
			_cmp.timeScale = new TimeScaleController({lockTable:this.lockTable, ctx: this});
			_cmp.timeScale.start();

			// Панель с информацией о лимитах, горячих/холодных номерах
			_cmp.infoPanel = new infoPanelController(presets.data.infoPanel);

			// Панель с информацией о выигрыше/ставке/балансе
			let betPanelCfg = !initConfig ? presets.data.betPanel :
				{fldBet: 0, fldWin: initConfig.total_win, fldBalance: initConfig.balance};
			_cmp.betPanelCtrl = new betPanelController(betPanelCfg);

			// Панель с рулеткой и лентой истории
			_cmp.historyCtrl = new historyController(
				presets.settings.history, {rollCb: this.rollNumber, ctx: this}, initConfig.balls
			);

			for(let key in _cmp)
				_stg.addChild(_cmp[key].pixiSprite);

			_stg.addChild(this.betsCnt = new _pxC());

			game.start();
		}, this);
	};

	checkActiveChip(){
		return _gm.activeChip;
	}

	restartGame(){
		_gm.resetModel();

		// Прописываем новый баланс. Добавляем в историю номер предыдущего розыгрыша
		_cmp.betPanelCtrl.updateInfoPanelView({fldBet: 0});
		this.interactiveSwitcher(true);
		_cmp.timeScale.start();
		_cmp.historyCtrl.play();
	};

	get touchEvents(){
		return this._touchEvents;
	}

	set touchEvents(event){
		for(let key in this._touchEvents)
			this._touchEvents[key] = false;

		this._touchEvents[event] = (event !== 'reset');
	}


	/**
	 * ========================================== Работа с моделью/данными =========================================
	 */
	/**
	 * Создание/апдейт ставки
	 */
	changeBets(pos4Bet, value, globalPos){
		if(!pos4Bet) return;

		let betsChange = (item)=>{
			let pos = !globalPos ? item.center :
				{x: item.center.x + presets.positions.fields.big.x,
					y: item.center.y + presets.positions.fields.big.y};

			let betStoreId = pos.x + '_' + pos.y;

			if(_gm.betsCtrl[betStoreId]){
				_gm.betsCtrl[betStoreId].updateBet(value);
			} else {
				let cfg = {pos: pos, info: item, value: value, callback: this.betCallback, ctx: this};
				_gm.betsCtrl[betStoreId] = new BetController(cfg);

				this.betsCnt.addChild(_gm.betsCtrl[betStoreId].betSprite);
				// Сортировка bet'ов, чтобы фишки налезали друг на друга правильно
				this.betsCnt.children.sort((a, b) => {return a.y > b.y});
			}
		};

		// Ячейки типа snake / обычные ячейки
		_hf.getClass(pos4Bet) === 'array' ?
			pos4Bet.forEach((item) => { betsChange(item) }) : betsChange(pos4Bet);

		this.updateBetModel();
	}

	/**
	 * Метод возвращает объект ячейки поля по координатам
	 * @param pos
	 * @param global - использовать глобальный координаты или координаты игрового поля (true | false)
	 * @returns {x|y}
	 */
	getDataForBet(pos, global){
		return _cmp.gameField.getDataForBet(pos, global);
	};

	/**
	 * Возвращаем объект ячейки поля по ставке
	 * @param betType
	 * @param betData
	 * @returns {*}
	 */
	getPositionForBet(betType, betData){
		return _cmp.gameField.getPositionForBet(betType, betData);
	};

	/**
	 * Обновление информации на панели ставок/баланса,выигрыша после изменения ставок
	 */
	updateBetModel(){
		let bet = 0;
		for(let key in _gm.betsCtrl){
			if(_gm.betsCtrl[key].balance === 0){
				_stg.removeChild( _gm.betsCtrl[key].betSprite )
				delete _gm.betsCtrl[key];
			} else {
				bet += _gm.betsCtrl[key].balance;
			}
		}

		_cmp.betPanelCtrl.updateInfoPanelView({fldBet: bet});
	};

	/**
	 * Обработчик подтверждения ставок от сервера
	 */
	confirmBets(betsServerStatus){
		if(!betsServerStatus){
			this.btnClear();

			_gm.deleteConfirmBets();
			_gm.deleteBetsCtrl();

			this.interactiveSwitcher(true);
		}
	}

	/**
	 * Делаем ставки по данным с сервера
	 */
	setServerBets(bets){
		bets.forEach((bet) => {
			let cell = this.getPositionForBet(bet.content.kind, bet.content[ bet.content.kind ]);

			this.changeBets(cell, bet.price, true);
		});
	}


	/**
	 * ========================================== Управление игровым столом =========================================
	 */
	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
		_cmp.gameField.hideHints();
	};

	/**
	 * Метод лочит панель фишек и кнопок по истечению времени
	 */
	lockTable(){
		this.interactiveSwitcher(false);

		this.clearTableBet();
		this.removeFloatChip();

		_cmp.chips.setDefault();

		setTimeout(() => {
			for(let key in _gm.betsCtrl){
				_gm.betsCtrl[key].clearBet();
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
		_cmp.gameField.showWinNum(number);

		// Рассчет выигрыша
		let win = _gm.calculateWin(number);
		if(win) presets.gameSounds.play('sound06');

		setTimeout(() => {
			if(win) _cmp.betPanelCtrl.updateInfoPanelView({fldWin: win});

			_cmp.gameField.hideWinNum();
		}, 3000)
	}

	/**
	 * Удаление плавающей фишки
	 */
	removeFloatChip(){
		if(this.fChip){
			_stg.removeChild(this.fChip.pixiSprite);
			_gm.activeChip = undefined;
			delete this.fChip;
		}
	}



	/**
	 * ===========================   Интерактивные события  ================================
	 */
	/**
	 * Коллбек для компонента ставок
	 */
	betCallback(type, data){
		if(type === 'change'){

			this.updateBetModel();

		} else if(type === 'touchStart'){

			this.touchEvents.betStart = true;
			_gm.touchBet = data;

		} else if(type === 'touchEnd'){

			_gm.touchBet = undefined;
			_gm.activeChip = undefined;
			this.touchEvents = 'reset';

		}
	}

	onTouchStart(event){}

	/**
	 * событие touchmove по всей сцене
	 * @param event
	 */
	onTouchMove(event){
		if(this.fChip) {
			this.fChip.setPosition( event.data.global );
			return false;
		}

		if( this.touchEvents.betStart ) {
			let value = _gm.touchBet.getTopChipValue();
			_gm.touchBet.updateBet( -value );
			_gm.activeChip = {value: value};
		}

		if(_gm.activeChip){
			this.fChip = new FloatChipController({value: _gm.activeChip.value});
			_stg.addChild(this.fChip.pixiSprite);
		}

		this.touchEvents = 'reset';
	};

	/**
	 * touchEnd по сцене. Создаёт ставку и скрывает плавающую фишку/скрывает подсказки
	 */
	onTouchEnd(event){
		let activeChip = _gm.activeChip || _cmp.chips.getActiveChipData();

		if(activeChip){
			let pos4Bet = this.getDataForBet(event.data.global, true);
			this.changeBets(pos4Bet, activeChip.value);
		}

		_gm.activeChip = undefined;
		this.removeFloatChip();
		this.clearTableBet();
	}

	/**
	 * Тачстарт начался с панели фишек
	 * @param chip
	 */
	chipTouchStart(chip){
		this.touchEvents.chipStart = true;
		_gm.activeChip = chip;
	};

	/**
	 * Для того, чтобы не рисовалист подсказки при touchMove на игровом поле и активной фишке на панели фишек
	 */
	chipTouchEnd(){
		_gm.activeChip = undefined;
	};



	/**
	 * ===========================   Коллбеки  ================================
	 */
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
		for(let key in _gm.betsCtrl)
			_stg.removeChild(_gm.betsCtrl[key].betSprite);
		_gm.deleteBetsCtrl();
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
		for(let key in _gm.betsCtrl)
			_gm.betsCtrl[key].updateBet( _gm.betsCtrl[key].balance );
	};

	/**
	 * Событие кнопки "BET" (передаётся коллбеком)
	 */
	betBtnClick(){
		if(_gm.isEmptyBetsCtrl) return false;

		_gm.calculateConfirmBets();

		// this.fromJs(_gm.fromJsMessage());

		this.interactiveSwitcher(false);
	};

	/**
	 * Включаем / выключаем интерактивность элементов
	 * @param status
	 */
	interactiveSwitcher(status){
		status = !!status;

		_stg.interactive = status;

		for(let key in _cmp){
			if(_cmp[key].disable && status) _cmp[key].enable();
			if(_cmp[key].disable && !status) _cmp[key].disable();
		}

		for(let key in _gm.betsCtrl){
			if(status) _gm.betsCtrl[key].enableMove();
			if(!status) _gm.betsCtrl[key].disableMove();
		}
	}
}