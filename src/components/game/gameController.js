import plugins from '../../plugins';
import momentJs from 'moment';
import Game from '../../Game';
import {assetLoader} from '../../services/resourseLoader'
import {touchEvents, gameSounds} from '../../constants/presets'
import settings from './settings'
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
import TimeScaleController  from '../timeScale/controller';
import infoPanelController  from '../infoPanel/infoPanelController';
import betPanelController   from '../betPanel/betPanelController';
import betButtonController  from '../betButton/betButtonController';
import historyController    from '../history/historyController';
import ExitController    	from '../exit/controller';
import ErrorsController    	from '../errors/controller';

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

		this.game = new Game(settings.game);
	}

	init(callback){
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

		this.gameModel = new GameModel();

		_gm = this.gameModel;
		_cmp = this._cmpCtrls;

		_stg = this.stage;

		/**
		 * background
		 */
		let bg = new Background();
		_stg.addChild(bg);
		_stg.interactive = true;


		touchEvents.start.forEach((event)=>{ _stg.on(event, this.onTouchStart, this) });

		touchEvents.move.forEach((event)=>{ _stg.on(event, this.onTouchMove, this) });

		touchEvents.end.forEach((event)=>{ _stg.on(event, this.onTouchEnd, this) });


		// Игровое поле
		_cmp.gameField = new GameFieldController({checkChips: this.checkActiveChip, ctx: this});

		// Прогружаем все json-атласы
		assetLoader( () => {

                _cmp.chips = new ChipController({touchEnd: this.chipTouchEnd, touchStart: this.chipTouchStart,ctx: this
			});

			// Панель кнопок
			let buttonsController = new ButtonController({
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
			//_cmp.timeScale.start();

			// Панель с информацией о лимитах, горячих/холодных номерах
			_cmp.infoPanel = new infoPanelController(settings.infoPanelData);

			// Панель с информацией о выигрыше/ставке/балансе
			_cmp.betPanelCtrl = new betPanelController();

			// Панель с рулеткой и лентой истории
			_cmp.historyCtrl = new historyController();

			for(let key in _cmp) {
				_stg.addChild(_cmp[key].pixiSprite);
            }

            let {stage} = this;
            let exit = new ExitController({exit: ()=>this.exit()});
            stage.addChild(exit.view.container);
            this._cmpCtrls.exit = exit;

			let errors = new ErrorsController();
			stage.addChild(errors.view.container);
			this._cmpCtrls.errors = errors;

			_stg.addChild(this.betsCnt = new _pxC());

			game.start();

			callback(JSON.stringify({kind: 'loaded_msg'}));
		}, this);
	};

	exit() {
		this.fromJs(JSON.stringify({kind: "exit_game_msg"}));
	}

	/**
	 * Обработка init_msg-сообщений
	 */
	initMessageHandler(gameData, authData, bets){
		this.animateTimeouts = [];

		this.prevBets = undefined;
		this.prevBetsActive = false;

		this.gameModel.balance = Math.floor(authData.balance);

		let betPanelCfg =  {fldBet: 0, fldWin: gameData.total_win, fldBalance: Math.floor(authData.balance)};
		_cmp.betPanelCtrl.setData(betPanelCfg);

		if(bets) this.setServerBets(bets);

		// game_state === 1 - игра закончена. Шкала времени уменьшается. Отображается число предыдущего выигрыша
		// game_state === 2 - розыгрышь. Ролится число. Шкалы времени нет
		if(+gameData.game_state === 1){
			this.interactiveSwitcher(!bets.length);

			_cmp.historyCtrl.setData(gameData.balls);

			_cmp.buttons.lockClear(true);

			_cmp.gameField.hideWinNum();

			let start = momentJs();
			let end = momentJs(gameData.end_bets_expected);
			let playTime = end.diff(start, 'seconds');
			console.log('init_msg, time for timeScale', playTime);
			//playTime = 6;

			// Анимация выпадающего числа
			_cmp.historyCtrl.showRollAnim(false);

			if(playTime > 0){
				// идёт розыгрыш со шкалой
				let tm1 = setTimeout(() => {
					_cmp.historyCtrl.showRollAnim(true).play();
				}, (playTime - settings.timeScale.changeColorPer * playTime) * 1000);
				this.animateTimeouts.push(tm1);

				// Задаём время шкале и запускаем её
				_cmp.timeScale.setTime(playTime).start();

			} else {
				// Всё ещё идёт розыгрыш без шкалы и с роллом числа
				_cmp.historyCtrl.showRollAnim(true).play();

				_cmp.timeScale.setTime(30).start();
			}


		} else if(+gameData.game_state === 2){
			this.interactiveSwitcher(false);

			if(gameData.balls.length){
				_cmp.timeScale.setState(4, gameData.balls[0]);
				_cmp.historyCtrl.showRollAnim(false).showRolledNum(gameData.balls[0]);
				_cmp.gameField.showWinNum(gameData.balls[0]);
			} else {
				_cmp.timeScale.setState(3);
				_cmp.gameField.hideWinNum();
				_cmp.historyCtrl.play();
			}
		}
	}

	/**
	 * Обработка rand_msg-сообщений
	 */
	randMessageHandler(gameData){
		this.clearTableBet();
		this.removeFloatChip();

		this.prevBetsActive = false;

		if(+gameData.game_state === 1){
			// Очистка стола от предыдущих ставок.
			this.clearTableBet();
			for(let key in _gm.betsCtrl){
				_gm.betsCtrl[key].clearBet();
				gameSounds.play('sound03');
			}
			setTimeout(() => this.btnClear(), 1000);

			_gm.resetModel();
			this.interactiveSwitcher(true);
			_cmp.buttons.lockClear(true);
			//_cmp.gameField.hideWinNum();
			setTimeout(() => _cmp.gameField.hideWinNum(), 3000);

			_cmp.historyCtrl.showRollAnim(true);
			//_cmp.historyCtrl.showRolledNum(gameData.balls[0]);

			let start = momentJs();
			let end = momentJs(gameData.end_bets_expected);
			let playTime = end.diff(start, 'seconds');
			console.log('init_msg, time for timeScale', playTime);
			//playTime = 6;

			// Анимация выпадающего числа
			if(gameData.balls.length){
				_cmp.historyCtrl.showRollAnim(false).addNum(gameData.balls[0], true).showRolledNum(gameData.balls[0]);
			}
			let tm1 = setTimeout(() => {
				_cmp.historyCtrl.showRollAnim(true).play();
			}, (playTime - settings.timeScale.changeColorPer * playTime) * 1000);
			this.animateTimeouts.push(tm1);

			// Задаём время шкале и запускаем её
			_cmp.timeScale.setTime(playTime).start();
		} else if(+gameData.game_state === 2){
			this.animateTimeouts.forEach(item => clearTimeout(item));
			this.animateTimeouts.length = 0;

			this.interactiveSwitcher(false);

			if(!gameData.balls.length){
				// Шаров нет. Крутим анимацию, скрываем шкалу

				_cmp.historyCtrl.showRollAnim(true).play();

				// Переводим таймскейл в состояние "Идёт игра"
				_cmp.timeScale.setState(3);
			} else {
				// Отключаем анимацию и показываем выигрышное число
				_cmp.historyCtrl.showRollAnim(false).showRolledNum(gameData.balls[0]);

				// Переводим таймскейл в состояние "выигрышное число"
				_cmp.timeScale.setState(4, gameData.balls[0]);

				// Скрываем (если есть) предыдущее выигршное число и показываем текущее
				_cmp.gameField.hideWinNum().showWinNum(gameData.balls[0]);

				let win = _gm.calculateWin(gameData.balls[0]);
				// Выигрыш с сервера
				win = gameData.total_win;
				if(win) {
					gameSounds.play('sound06');
					_cmp.betPanelCtrl.updateInfoPanelView({fldWin: win});

					this.gameModel.balance = _cmp.betPanelCtrl.data.fldBalance+win;

					setTimeout(() => {
						_cmp.betPanelCtrl.updateInfoPanelView({fldWin: 0, fldBalance: _cmp.betPanelCtrl.data.fldBalance+win});
					}, 5000)
				}
			}
		}
	}

	/**
	 * Обработчик сообщений с kind === "error_msg"
	 */
	errorsHandler(code){
		// Коды ошибок, при которых лочится клиент; слетают ставки
		let lockClient = [-1, 102, 106],
			clearBets = [401, 402];

		if(clearBets.includes(code)) this.confirmBets(false);

		this._cmpCtrls.errors.viewError(code, lockClient.includes(code));

		if(lockClient.includes(code)) this.interactiveSwitcher(false);
	}

	checkActiveChip(){
		return _gm.activeChip;
	}

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
				{x: item.center.x + settings.gameField.x,
					y: item.center.y + settings.gameField.y};

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
				_stg.removeChild( _gm.betsCtrl[key].betSprite );
				delete _gm.betsCtrl[key];
			} else {
				bet += _gm.betsCtrl[key].balance;
			}
		}

		_cmp.buttons.lockClear(!(bet > 0));

		let newBalance = this.gameModel.balance-bet;

		_cmp.betPanelCtrl.updateInfoPanelView({fldBet: bet, fldBalance: newBalance});
	};

	/**
	 * Обработчик подтверждения ставок от сервера
	 */
	confirmBets(betsServerStatus){
		if(!betsServerStatus){
			// Если ставка не прошла
			this.btnClear();

			_gm.deleteConfirmBets();
			_gm.deleteBetsCtrl();

			this.interactiveSwitcher(true);
		} else {
			this.gameModel.balance = Math.floor(betsServerStatus.balance);
			_cmp.betPanelCtrl.updateInfoPanelView({fldBalance: Math.floor(betsServerStatus.balance)});
			this.interactiveSwitcher(false);
		}
	}

	/**
	 * Делаем ставки по данным с сервера
	 */
	setServerBets(bets){
		let currentBetsValue = 0;
		bets.forEach((item) => currentBetsValue += item.price);

		if(currentBetsValue > _cmp.betPanelCtrl.data.fldBalance){
			this._cmpCtrls.errors.viewError(402);
		} else {
			bets.forEach((bet) => {
				let cell = this.getPositionForBet(bet.content.kind, bet.content[ bet.content.kind ]);

				this.changeBets(cell, bet.price, true);
			});
		}
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
				gameSounds.play('sound03');
			}
		}, 2000);
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
		let koeff = settings.coefficients;

		if(this.fChip) {
			this.fChip.setPosition( event.data.global );

			let obj = this.getDataForBet(event.data.global, true);
			this.fChip.setKoeff( obj ? koeff[obj.numbers.length] : null );

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
			console.log('pos4Bet ➠ ', pos4Bet);
			if(_cmp.betPanelCtrl.data.fldBalance - activeChip.value < 0){
				if(pos4Bet) this._cmpCtrls.errors.viewError(402);
			} else {
				this.changeBets(pos4Bet, activeChip.value);
			}
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
	 * Событие кнопки "очистить" (передаётся коллбеком)
	 */
	btnClear(){
		for(let key in _gm.betsCtrl)
			this.betsCnt.removeChild(_gm.betsCtrl[key].betSprite);

		_cmp.betPanelCtrl.updateInfoPanelView({fldBet: 0, fldBalance: this.gameModel.balance});

		this.prevBetsActive = false;

		_gm.deleteBetsCtrl();

		_cmp.buttons.lockClear(true);
	};

	/**
	 * Событие кнопки "повторить ставки" (передаётся коллбеком)
	 */
	btnRepeat(){
		// this.prevBets = '{"kind":"bets_msg",' +
		// 	'"bets":[' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[28,31]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[19]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[27]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[7,10]}}' +
		// 	']}';

		if(this.prevBetsActive || !this.prevBets) return;

		let data = JSON.parse(this.prevBets);

		this.setServerBets(data.bets);

		this.prevBetsActive = true;
	};

	/**
	 * Событие кнопки "удвоить ставки" (передаётся коллбеком)
	 */
	btnX2(){
		let currentBetsValue = 0;
		for(let key in _gm.betsCtrl)
			currentBetsValue += _gm.betsCtrl[key].balance;

		if(currentBetsValue > _cmp.betPanelCtrl.data.fldBalance){
			this._cmpCtrls.errors.viewError(402);
		} else {
			for(let key in _gm.betsCtrl){
				_gm.betsCtrl[key].updateBet( _gm.betsCtrl[key].balance );
			}
		}

	};

	/**
	 * Событие кнопки "BET" (передаётся коллбеком)
	 */
	betBtnClick(){
		if(_gm.isEmptyBetsCtrl) return false;

		_gm.calculateConfirmBets();

		// Запоминаем в историю
		this.prevBets = _gm.fromJsMessage();

		this.fromJs(this.prevBets);

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