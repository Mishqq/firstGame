import plugins from '../../plugins';
import momentJs from 'moment';
import Game from '../../Game';
import {assetLoader} from '../../services/resourseLoader'
import {touchEvents, gameSounds} from '../../constants/presets'
import settings from './settings'
import {_pxC} from './../../constants/PIXIabbr';

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


/**
 * Плохо оно само получится ©
 */
export default class GameController {
	constructor(fromJs){
		this.fromJs = fromJs;

		this.game = new Game(settings.game);
	}

	init(callback){
		let game = this.game;

		this.componentCotrollers = {};      // Component controller instances collection
		this.gameModel = new GameModel();
		this.stage = game.stage;

		let {componentCotrollers: cmpCtrl, stage: st} = this;

		this._touchEvents = {
			betStart: false,
			betEnd: false,
			chipStart: false,
			move: false
		};

		st.addChild( new Background() );
		st.interactive = true;

		touchEvents.start.forEach((event)=>{ st.on(event, this.onTouchStart, this) });

		touchEvents.move.forEach((event)=>{ st.on(event, this.onTouchMove, this) });

		touchEvents.end.forEach((event)=>{ st.on(event, this.onTouchEnd, this) });


		// Игровое поле
		cmpCtrl.gameField = new GameFieldController({checkChips: this.checkActiveChip, ctx: this});

		// Прогружаем все json-атласы
		assetLoader( () => {
			cmpCtrl.chips = new ChipController({touchEnd: this.chipTouchEnd, touchStart: this.chipTouchStart,ctx: this
			});

			// Панель кнопок
			cmpCtrl.buttons = new ButtonController({
				btnClear: this.btnClear,
				btnRepeat: this.btnRepeat,
				btnX2: this.btnX2,
				ctx: this
			});

			// Плавающая фишка
			cmpCtrl.betBtn = new betButtonController({betBtnClick: this.betBtnClick, ctx: this});

			// Шкала-таймер
			cmpCtrl.timeScale = new TimeScaleController();

			// Панель с информацией о лимитах, горячих/холодных номерах
			cmpCtrl.infoPanel = new infoPanelController(settings.infoPanelData);

			// Панель с информацией о выигрыше/ставке/балансе
			cmpCtrl.betPanelCtrl = new betPanelController();

			// Панель с рулеткой и лентой истории
			cmpCtrl.historyCtrl = new historyController();

			cmpCtrl.exit = new ExitController({exit: ()=>this.exit()});

			cmpCtrl.errors = new ErrorsController();

			for(let key in cmpCtrl)
				if(cmpCtrl.hasOwnProperty(key)) st.addChild(cmpCtrl[key].pixiSprite);

			st.addChild(this.betsContainer = new _pxC());

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
		let {componentCotrollers: cmpCtrl} = this;

		this.animateTimeouts = [];

		this.prevBets = undefined;
		this.prevBetsActive = false;

		this.gameModel.balance = Math.floor(authData.balance);

		// TODO: если есть выигрышь со старой игры - сделать анимацию перечисления
		let betPanelCfg = {fldBet: 0, fldWin: 0, fldBalance: this.gameModel.balance};
		cmpCtrl.betPanelCtrl.setData(betPanelCfg);
		if(bets) {
			this.setServerBets(bets);
			cmpCtrl.betPanelCtrl.setData({fldBalance: this.gameModel.balance});
		}

		// game_state === 1 - игра закончена. Шкала времени уменьшается. Отображается число предыдущего выигрыша
		// game_state === 2 - розыгрышь. Ролится число. Шкалы времени нет
		if(+gameData.game_state === 1){
			this.interactiveSwitcher(!bets.length);

			this.betBtnClickStatus = false;

			cmpCtrl.historyCtrl.setData(gameData.balls);

			cmpCtrl.buttons.lockClear(true);

			cmpCtrl.gameField.hideWinNum();

			let start = momentJs();
			let end = momentJs(gameData.end_bets_expected);
			let playTime = end.diff(start, 'seconds');
			console.log('init_msg, time for timeScale', playTime);
			//playTime = 6;

			// Анимация выпадающего числа
			cmpCtrl.historyCtrl.showRollAnim(false);

			if(playTime > 0){
				// идёт розыгрыш со шкалой
				let tm1 = setTimeout(() => {
					cmpCtrl.historyCtrl.showRollAnim(true).play();
				}, (playTime - settings.timeScale.changeColorPer * playTime) * 1000);
				this.animateTimeouts.push(tm1);

				// Задаём время шкале и запускаем её
				cmpCtrl.timeScale.setTime(playTime).start();

			} else {
				// Всё ещё идёт розыгрыш без шкалы и с роллом числа
				cmpCtrl.historyCtrl.showRollAnim(true).play();

				cmpCtrl.timeScale.setTime(30).start();
			}


		} else if(+gameData.game_state === 2){
			this.interactiveSwitcher(false);

			if(gameData.balls.length){
				cmpCtrl.timeScale.setState(4, gameData.balls[0]);
				cmpCtrl.historyCtrl.showRollAnim(false).showRolledNum(gameData.balls[0]);
				cmpCtrl.gameField.showWinNum(gameData.balls[0]);

				let win = gameData.total_win;
				if(win) {
					gameSounds.play('sound06');
					cmpCtrl.betPanelCtrl.setData({fldWin: win});

					this.gameModel.balance = cmpCtrl.betPanelCtrl.data.fldBalance+win;
				}
			} else {
				cmpCtrl.timeScale.setState(3);
				cmpCtrl.gameField.hideWinNum();
				cmpCtrl.historyCtrl.play();
			}
		}
	}

	/**
	 * Обработка rand_msg-сообщений
	 */
	randMessageHandler(gameData){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		this.clearTableBet();
		this.removeFloatChip();

		this.prevBetsActive = false;

		if(+gameData.game_state === 1){
			this.betBtnClickStatus = false;

			// Очистка стола от предыдущих ставок.
			this.clearTableBet();
			for(let key in GM.betsCtrl){
				if(!GM.betsCtrl.hasOwnProperty(key)) continue;

				GM.betsCtrl[key].clearBet();
				gameSounds.play('sound03');

				let b =cmpCtrl.betPanelCtrl.data;
				cmpCtrl.betPanelCtrl.setData({fldWin: 0, fldBalance: b.fldBalance+b.fldWin});
			}
			setTimeout(() => this.btnClear(), 1000);

			cmpCtrl.betPanelCtrl.setData({fldBet: 0, fldWin: 0, fldBalance: this.gameModel.balance});

			GM.resetModel();
			this.interactiveSwitcher(true);
			cmpCtrl.buttons.lockClear(true);
			//cmpCtrl.gameField.hideWinNum();
			setTimeout(() => cmpCtrl.gameField.hideWinNum(), 3000);

			cmpCtrl.historyCtrl.showRollAnim(true);
			//cmpCtrl.historyCtrl.showRolledNum(gameData.balls[0]);

			let start = momentJs();
			let end = momentJs(gameData.end_bets_expected);
			let playTime = end.diff(start, 'seconds');
			console.log('init_msg, time for timeScale', playTime);
			//playTime = 6;

			// Анимация выпадающего числа
			if(gameData.balls.length){
				cmpCtrl.historyCtrl.showRollAnim(false).addNum(gameData.balls[0], true).showRolledNum(gameData.balls[0]);
			}
			let tm1 = setTimeout(() => {
				cmpCtrl.historyCtrl.showRollAnim(true).play();
			}, (playTime - settings.timeScale.changeColorPer * playTime) * 1000);
			this.animateTimeouts.push(tm1);

			// Задаём время шкале и запускаем её
			cmpCtrl.timeScale.setTime(playTime).start();
		} else if(+gameData.game_state === 2){
			this.animateTimeouts.forEach(item => clearTimeout(item));
			this.animateTimeouts.length = 0;

			this.interactiveSwitcher(false);

			if(!gameData.balls.length){
				// Шаров нет. Крутим анимацию, скрываем шкалу
				cmpCtrl.historyCtrl.showRollAnim(true).play();

				// Переводим таймскейл в состояние "Идёт игра"
				cmpCtrl.timeScale.setState(3);

				if(!this.betBtnClickStatus){
					for(let key in GM.betsCtrl){
						if(!GM.betsCtrl.hasOwnProperty(key)) continue;

						GM.betsCtrl[key].clearBet();
						gameSounds.play('sound03');

						let nums = cmpCtrl.betPanelCtrl.data;
						cmpCtrl.betPanelCtrl.setData({fldBet: 0, fldWin: 0, fldBalance: nums.fldBalance + nums.fldBet});
					}
				}
			} else {
				// Отключаем анимацию и показываем выигрышное число
				cmpCtrl.historyCtrl.showRollAnim(false).showRolledNum(gameData.balls[0]);

				// Переводим таймскейл в состояние "выигрышное число"
				cmpCtrl.timeScale.setState(4, gameData.balls[0]);

				// Скрываем (если есть) предыдущее выигршное число и показываем текущее
				cmpCtrl.gameField.hideWinNum().showWinNum(gameData.balls[0]);

				//let win = GM.calculateWin(gameData.balls[0]);
				// Выигрыш с сервера
				let win = gameData.total_win;
				if(win) {
					gameSounds.play('sound06');
					cmpCtrl.betPanelCtrl.setData({fldWin: win});

					this.gameModel.balance = cmpCtrl.betPanelCtrl.data.fldBalance+win;
				}
			}
		}
	}

	/**
	 * Обработчик сообщений с kind === "error_msg"
	 */
	errorsHandler(code){
		let {componentCotrollers: cmpCtrl} = this;
		// Коды ошибок, при которых лочится клиент; слетают ставки
		let lockClient = [-1, 102, 106, 401],
			clearBets = [401, 402];

		if(clearBets.includes(code)) this.confirmBets(false);

		cmpCtrl.errors.viewError(code, lockClient.includes(code));

		if(lockClient.includes(code)) this.interactiveSwitcher(false);
	}

	checkActiveChip(){
		let {gameModel: GM} = this;
		return GM.activeChip;
	}

	get touchEvents(){
		return this._touchEvents;
	}

	set touchEvents(event){
		let {_touchEvents: tEv} = this;

		for(let key in tEv)
			if(tEv.hasOwnProperty(key)) tEv[key] = false;

		tEv[event] = (event !== 'reset');
	}


	/**
	 * ========================================== Работа с моделью/данными =========================================
	 */
	/**
	 * Создание/апдейт ставки
	 */
	changeBets(pos4Bet, value, globalPos){
		let {gameModel: GM, betsContainer: betsCnt} = this;

		if(!pos4Bet) return;

		let betsChange = (item)=>{
			let pos = !globalPos ? item.center :
				{x: item.center.x + settings.gameField.x,
					y: item.center.y + settings.gameField.y};

			let betStoreId = pos.x + '_' + pos.y;

			if(GM.betsCtrl[betStoreId]){
				GM.betsCtrl[betStoreId].updateBet(value);
			} else {
				let cfg = {pos: pos, info: item, value: value, callback: this.betCallback, ctx: this};
				GM.betsCtrl[betStoreId] = new BetController(cfg);

				betsCnt.addChild(GM.betsCtrl[betStoreId].betSprite);
				// Сортировка bet'ов, чтобы фишки налезали друг на друга правильно
				betsCnt.children.sort((a, b) => a.y - b.y);
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
		let {componentCotrollers: cmpCtrl} = this;

		return cmpCtrl.gameField.getDataForBet(pos, global);
	};

	/**
	 * Возвращаем объект ячейки поля по ставке
	 * @param betType
	 * @param betData
	 * @returns {*}
	 */
	getPositionForBet(betType, betData){
		let {componentCotrollers: cmpCtrl} = this;

		return cmpCtrl.gameField.getPositionForBet(betType, betData);
	};

	/**
	 * Обновление информации на панели ставок/баланса,выигрыша после изменения ставок
	 */
	updateBetModel(){
		let {componentCotrollers: cmpCtrl, gameModel: GM, stage: st} = this,
			{buttons, betPanelCtrl: betPanel} = cmpCtrl,
			bet = 0;

		for(let key in GM.betsCtrl){
			if(!GM.betsCtrl.hasOwnProperty(key)) continue;

			if(GM.betsCtrl[key].balance === 0){
				st.removeChild( GM.betsCtrl[key].betSprite );
				delete GM.betsCtrl[key];
			} else {
				bet += GM.betsCtrl[key].balance;
			}
		}

		buttons.lockClear(!(bet > 0));

		let newBalance = this.gameModel.balance-bet;

		betPanel.setData({fldBet: bet, fldBalance: newBalance});
	};

	/**
	 * Обработчик подтверждения ставок от сервера
	 */
	confirmBets(betsServerStatus){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this,
			{betPanelCtrl: betPanel} = cmpCtrl;

		if(!betsServerStatus){
			// Если ставка не прошла
			this.btnClear();

			GM.deleteConfirmBets();
			GM.deleteBetsCtrl();

			this.interactiveSwitcher(true);
		} else {
			this.gameModel.balance = Math.floor(betsServerStatus.balance);
			betPanel.setData({fldBalance: Math.floor(betsServerStatus.balance)});
			this.interactiveSwitcher(false);
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
		let {componentCotrollers: cmpCtrl} = this;

		cmpCtrl.gameField.hideHints();
	};

	/**
	 * Удаление плавающей фишки
	 */
	removeFloatChip(){
		let {gameModel: GM, stage: st} = this;

		if(!this.fChip) return;

		st.removeChild(this.fChip.pixiSprite);
		GM.activeChip = undefined;
		delete this.fChip;
	}


	/**
	 * ===========================   Интерактивные события  ================================
	 */
	/**
	 * Коллбек для компонента ставок
	 */
	betCallback(type, data){
		let {gameModel: GM} = this;

		if(type === 'change'){

			this.updateBetModel();

		} else if(type === 'touchStart'){

			this.touchEvents.betStart = true;
			GM.touchBet = data;

		} else if(type === 'touchEnd'){

			GM.touchBet = undefined;
			GM.activeChip = undefined;
			this.touchEvents = 'reset';

		}
	}

	onTouchStart(event){}

	/**
	 * событие touchmove по всей сцене
	 * @param event
	 */
	onTouchMove(event){
		let {gameModel: GM, stage: st} = this;

		let koeff = settings.coefficients;

		if(this.fChip) {
			this.fChip.setPosition( event.data.global );

			let obj = this.getDataForBet(event.data.global, true);
			this.fChip.setKoeff( obj ? koeff[obj.numbers.length] : null );

			return false;
		}

		if( this.touchEvents.betStart ) {
			let value = GM.touchBet.getTopChipValue();
			GM.touchBet.updateBet( -value );
			GM.activeChip = {value: value};
		}

		if(GM.activeChip){
			this.fChip = new FloatChipController({value: GM.activeChip.value});
			st.addChild(this.fChip.pixiSprite);
		}

		this.touchEvents = 'reset';
	};

	/**
	 * touchEnd по сцене. Создаёт ставку и скрывает плавающую фишку/скрывает подсказки
	 */
	onTouchEnd(event){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		let activeChip = GM.activeChip || cmpCtrl.chips.getActiveChipData();

		if(activeChip){
			let pos4Bet = this.getDataForBet(event.data.global, true);
			console.log('pos4Bet ➠ ', pos4Bet);
			if(cmpCtrl.betPanelCtrl.data.fldBalance - activeChip.value < 0){
				if(pos4Bet) cmpCtrl.errors.viewError(402);
			} else {
				this.changeBets(pos4Bet, activeChip.value);
			}
		}

		GM.activeChip = undefined;
		this.removeFloatChip();
		this.clearTableBet();
	}

	/**
	 * Тачстарт начался с панели фишек
	 * @param chip
	 */
	chipTouchStart(chip){
		let {gameModel: GM} = this;

		this.touchEvents.chipStart = true;
		GM.activeChip = chip;
	};

	/**
	 * Для того, чтобы не рисовалист подсказки при touchMove на игровом поле и активной фишке на панели фишек
	 */
	chipTouchEnd(){
		let {gameModel: GM} = this;

		GM.activeChip = undefined;
	};



	/**
	 * ===========================   Коллбеки  ================================
	 */
	/**
	 * Событие кнопки "очистить" (передаётся коллбеком)
	 */
	btnClear(){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		for(let key in GM.betsCtrl)
			if(GM.betsCtrl.hasOwnProperty(key)) this.betsContainer.removeChild(GM.betsCtrl[key].betSprite);

		cmpCtrl.betPanelCtrl.setData({fldBet: 0, fldBalance: this.gameModel.balance});

		this.prevBetsActive = false;

		GM.deleteBetsCtrl();

		cmpCtrl.buttons.lockClear(true);
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
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this, currentBetsValue = 0;

		for(let key in GM.betsCtrl)
			if(GM.betsCtrl.hasOwnProperty(key)) currentBetsValue += GM.betsCtrl[key].balance;

		if(currentBetsValue > cmpCtrl.betPanelCtrl.data.fldBalance){
			cmpCtrl.errors.viewError(402);
		} else {
			for(let key in GM.betsCtrl)
				if(GM.betsCtrl.hasOwnProperty(key)) GM.betsCtrl[key].updateBet( GM.betsCtrl[key].balance );
		}

	};

	/**
	 * Событие кнопки "BET" (передаётся коллбеком)
	 */
	betBtnClick(){
		let {gameModel: GM} = this;

		if(GM.isEmptyBetsCtrl) return false;

		GM.calculateConfirmBets();

		// Запоминаем в историю
		this.prevBets = GM.fromJsMessage();

		this.betBtnClickStatus = true;

		this.fromJs(this.prevBets);

		this.interactiveSwitcher(false);
	};

	/**
	 * Включаем / выключаем интерактивность элементов
	 * @param status
	 */
	interactiveSwitcher(status){
		let {componentCotrollers: cmpCtrl, gameModel: GM, stage: st} = this;

		status = !!status;

		st.interactive = status;

		for(let key in cmpCtrl){
			if(cmpCtrl.hasOwnProperty(key)){
				if(cmpCtrl[key].disable && status) cmpCtrl[key].enable();
				if(cmpCtrl[key].disable && !status) cmpCtrl[key].disable();
			}
		}

		for(let key in GM.betsCtrl){
			if(GM.betsCtrl.hasOwnProperty(key)){
				if(status) GM.betsCtrl[key].enableMove();
				if(!status) GM.betsCtrl[key].disableMove();
			}
		}
	}
}