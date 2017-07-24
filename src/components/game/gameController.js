import plugins from '../../plugins';
import momentJs from 'moment';
import Game from '../../Game';
import {assetLoader} from '../../services/resourseLoader'
import {touchEvents, gameSounds} from '../../constants/presets'
import settings from './settings'
import {_p, _pxC} from './../../constants/PIXIabbr';
import globalSettings from './../../constants/globalSettings';

import GameModel from './gameModel';
import {_hf} from '../../services/helpFunctions';

// Components
import Background           from '../background/background';
import GameFieldController  from '../gameField/gameFieldController';
import ButtonController     from '../button/controller';
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
import debugWindow    	    from '../debugWindow/controller';


/**
 * Плохо оно само получится ©
 */
export default class GameController {
	constructor(fromJs){
		this.touchCount = 0;

		this.fromJs = fromJs;

		this.game = new Game(settings.game);

		this.rollbackCount = 0;
	}

	init(callback){
		let game = this.game;

		this.componentCotrollers = {};      // Component controller instances collection
		this.gameModel = new GameModel();
		this.stage = game.stage;

		// let intMan = this.game.renderer.plugins.interaction;
		// let tickFn = ()=>{
		// 	console.log('intMan.interactiveDataPool.length ➠ ', intMan.interactiveDataPool.length);
		// 	setTimeout(tickFn, 1000)
		// };
		// tickFn();

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
				btnCancel: this.btnCancel,
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

			this.debugW = new debugWindow();
			st.addChild(this.debugW.pixiSprite);

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
		this.debugW.addText('gameData: ' + JSON.stringify(gameData), 1);
		this.debugW.addText('authData: ' + JSON.stringify(authData), 2);
		this.debugW.addText('bets: ' + JSON.stringify(bets), 3);

		this.animateTimeouts = [];
		this.prevBets = undefined;
		this.prevBetsActive = false;

		// TODO: если есть выигрышь со старой игры - сделать анимацию перечисления
		this.userData('updateModel', {fldBet: 0, fldWin: 0, fldBalance: Math.floor(authData.balance)});
		if(bets.length) this.setServerBets(bets);

		// game_state === 1 - игра закончена. Шкала времени уменьшается. Отображается число предыдущего выигрыша
		// game_state === 2 - розыгрышь. Ролится число. Шкалы времени нет
		+gameData.game_state === 1 ?  this.initMsgState_1(gameData, bets) :
			gameData.balls.length ? this.initMsgState_2_balls(gameData) : this.initMsgState_2_noBalls();
	}

	/**
	 * Состояние с game_state === 1
	 * Игра завершена. Открыта возможность ставок для новой игры
	 * Если время розыгрыша с сервера отрицательное, значит идёт идёт ролл числа
	 * На блочке - "next game"
	 */
	initMsgState_1(gameData, bets){
		let {componentCotrollers: cmpCtrl} = this;
		this.interactiveSwitcher(!bets.length);

		this.betBtnClickStatus = false;

		cmpCtrl.historyCtrl.setData(gameData.balls); // Добавляем выпавшие шары из прошлых розыгрышей
		cmpCtrl.buttons.lockClear(true); // Блокировка "Очистить"
		cmpCtrl.buttons.lockCancel(true);
		cmpCtrl.gameField.hideWinNum(); // Отключение подсветки выигрышного номера
		cmpCtrl.historyCtrl.showRollAnim(false); // Анимация выпадающего числа

		let start = momentJs(),
			end = momentJs(gameData.end_bets_expected),
			playTime = end.diff(start, 'seconds');

		// playTime = 30; // для локальной отладки

		// playTime > 0 ? идёт розыгрыш со шкалой : Всё ещё идёт розыгрыш без шкалы и с роллом числа;
		if(playTime > 0){
			// Когда жёлтая шкала становится красной - начинается ролл числа
			let rollTime = (playTime - settings.timeScale.changeColorPer * playTime) * 1000;
			let tm1 = setTimeout(() => cmpCtrl.historyCtrl.showRollAnim(true).play(), rollTime);
			this.animateTimeouts.push(tm1);

			cmpCtrl.timeScale.setTime(playTime).start(); // Задаём время шкале и запускаем её
		} else {
			cmpCtrl.historyCtrl.showRollAnim(true).play();
			cmpCtrl.timeScale.setTime(30).start();
		}
	}

	/**
	 * Состояние с game_state === 2 (без выпавшего шара)
	 * На блочке - "End bets"
	 */
	initMsgState_2_noBalls(){
		let {componentCotrollers: cmpCtrl} = this;
		this.interactiveSwitcher(false);

		cmpCtrl.timeScale.setState(3);
		cmpCtrl.gameField.hideWinNum();
		cmpCtrl.historyCtrl.play();
	}

	/**
	 * Состояние с game_state === 2 и выпавшим шаром
	 * На блочке - задать выигрышное число
	 */
	initMsgState_2_balls(gameData){
		let {componentCotrollers: cmpCtrl} = this;
		this.interactiveSwitcher(false);

		let viewNum = gameData.balls[0] === 0 ? '0' : gameData.balls[0] === 37 ? '00' : gameData.balls[0];
		cmpCtrl.timeScale.setState(4, viewNum);
		cmpCtrl.historyCtrl.showRollAnim(false).showRolledNum(gameData.balls[0]);
		cmpCtrl.gameField.showWinNum(gameData.balls[0]);

		let win = gameData.total_win;
		if(win) {
			gameSounds.play('sound06');
			this.userData({fldWin: win});
		}
	}



	/**
	 * Обработка rand_msg-сообщений
	 */
	randMessageHandler(gameData){
		this.debugW.addText('gameData: ' + JSON.stringify(gameData), 1);

		this.hideTableHints();
		this.removeFloatChip();
		this.prevBetsActive = false;

		+gameData.game_state === 1 ?  this.randMsgState_1(gameData) :
			gameData.balls.length ? this.randMsgState_2_balls(gameData) : this.randMsgState_2_noBalls();
	}

	/**
	 * Состояние с game_state === 1
	 * Игра завершена. Открыта возможность ставок для новой игры
	 * Если время розыгрыша с сервера отрицательное, значит идёт идёт ролл числа
	 * На блочке - "next game"
	 */
	randMsgState_1(gameData){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		// Если у нас есть ставки, то на этом этапе игры они становятся сыгранными
		// Сыгранные ставки очащаем с началом новой игры
		this.betStoreInterface('deleteBets', 'played');

		this.betBtnClickStatus = false;

		this.userData({fldBet: 0, fldWin: 0, fldBalance: GM.data.fldBalance+GM.data.fldWin});
		setTimeout(() => this.btnClear(), 1000);

		GM.resetModel();
		this.interactiveSwitcher(true);
		cmpCtrl.buttons.lockClear(true);
		cmpCtrl.buttons.lockCancel(true);
		//cmpCtrl.gameField.hideWinNum();
		setTimeout(() => cmpCtrl.gameField.hideWinNum(), 3000);

		cmpCtrl.historyCtrl.showRollAnim(true);
		//cmpCtrl.historyCtrl.showRolledNum(gameData.balls[0]);

		let start = momentJs(),
			end = momentJs(gameData.end_bets_expected),
			playTime = end.diff(start, 'seconds');

		// playTime = 30; // для локальной отладки

		// Анимация выпадающего числа
		if(gameData.balls.length)
			cmpCtrl.historyCtrl
				.showRollAnim(false)
				.addNum(gameData.balls[0], true)
				.showRolledNum(gameData.balls[0]);

		let rollTime = (playTime - settings.timeScale.changeColorPer * playTime) * 1000;
		let tm1 = setTimeout(() => cmpCtrl.historyCtrl.showRollAnim(true).play(), rollTime);
		this.animateTimeouts.push(tm1);

		// Задаём время шкале и запускаем её
		cmpCtrl.timeScale.setTime(playTime).start();
	}

	/**
	 * Состояние с game_state === 2 (без выпавшего шара)
	 * На блочке - "End bets"
	 */
	randMsgState_2_noBalls(){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		this.animateTimeouts.forEach(item => clearTimeout(item));
		this.animateTimeouts.length = 0;
		this.interactiveSwitcher(false);
		cmpCtrl.gameField.hideWinNum();
		this.userData({fldWin: 0});

		// Шаров нет. Крутим анимацию, скрываем шкалу
		cmpCtrl.historyCtrl.showRollAnim(true).play();

		// Переводим таймскейл в состояние "Идёт игра"
		cmpCtrl.timeScale.setState(3);

		if(!this.betBtnClickStatus) this.betStoreInterface('deleteBets', '!confirm');
	}

	/**
	 * Состояние с game_state === 2 и выпавшим шаром
	 * На блочке - задать выигрышное число
	 */
	randMsgState_2_balls(gameData){
		let {componentCotrollers: cmpCtrl} = this;

		// Если у нас есть ставки, то на этом этапе игры они становятся сыгранными
		// Сыгранные ставки очащаем с началом новой игры
		this.betStoreInterface('playedBets');

		this.animateTimeouts.forEach(item => clearTimeout(item));
		this.animateTimeouts.length = 0;
		this.interactiveSwitcher(false);

		// Отключаем анимацию и показываем выигрышное число
		cmpCtrl.historyCtrl
			.showRollAnim(false)
			.showRolledNum(gameData.balls[0]);

		// Переводим таймскейл в состояние "выигрышное число"
		let viewNum = gameData.balls[0] === 0 ? '0' : gameData.balls[0] === 37 ? '00' : gameData.balls[0];
		cmpCtrl.timeScale.setState(4, viewNum);

		// Скрываем (если есть) предыдущее выигршное число и показываем текущее
		cmpCtrl.gameField.hideWinNum().showWinNum(gameData.balls[0]);

		//let win = GM.calculateWin(gameData.balls[0]);
		// Выигрыш с сервера
		let win = gameData.total_win;
		if(win) {
			gameSounds.play('sound06');
			this.userData({fldWin: win});
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
		let {betsContainer: betsCnt} = this;

		if(!pos4Bet) return;

		let betsChange = (item)=>{
			let pos = !globalPos ? item.center :
				{x: item.center.x + settings.gameField.x,
					y: item.center.y + settings.gameField.y};

			let betStoreId = pos.x + '_' + pos.y;

			let limits = globalSettings.betLimits[item.numbers.length];

			let currentBet = this.betStoreInterface('findById', betStoreId);
			if(currentBet){
				currentBet.ctrl.updateBet(value);
			} else if(value > limits.max || value < limits.min) {
				console.log('Ставка выходит за пределы лимитов');
			} else {
				let cfg = {pos: pos, info: item, value: value, callback: this.betCallback, ctx: this};
				let newBet = new BetController(cfg);

				let newStoreBet = {
					ctrl: newBet,
					id: betStoreId,
					confirm: false,
					played: false
				};
				this.betStoreInterface('add', newStoreBet);

				betsCnt.addChild(newStoreBet.ctrl.betSprite);
				// Сортировка bet'ов, чтобы фишки налезали друг на друга правильно
				betsCnt.children.sort((a, b) => a.y - b.y);
			}
		};

		// Ячейки типа snake / обычные ячейки
		_hf.getClass(pos4Bet) === 'array' ?
			pos4Bet.forEach((item) => { betsChange(item) }) : betsChange(pos4Bet);
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
	 * Обработчик подтверждения ставок от сервера
	 */
	confirmBets(betsServerStatus){
		this.debugW.addText('gameData: ' + JSON.stringify(betsServerStatus), 3);

		if(!betsServerStatus){
			// Если ставка не прошла
			this.btnClear();

			this.betStoreInterface('deleteBets', true);
			this.interactiveSwitcher(true);
		} else {
			this.betStoreInterface('confirmBets');

			this.hideTableHints();
			this.removeFloatChip();

			this.userData('updateModel', {fldBalance: Math.floor(betsServerStatus.balance)});
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

		this.userData({fldBet: this.betStoreInterface('betSumm')});
	}

	/**
	 * Интерфейс для работы с массивом ставок
	 */
	betStoreInterface(...rest){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this,
			{betPanelCtrl: betPanel, errors}  = cmpCtrl,
			flag = rest[0];

		let deleteSomeBet = (bet, animation)=>{
			if(animation){
				bet.ctrl.clearBet();
				setTimeout(() => this.betsContainer.removeChild(bet.ctrl.betSprite), 1000);
			} else {
				this.betsContainer.removeChild(bet.ctrl.betSprite)
			}
			gameSounds.play('sound03');
		};

		if(flag === 'add'){ // Добавить объект ставки в массив
			GM.betStore.push(rest[1]);

		} else if(flag === 'confirmBets'){ // Подтвердить все ставки
			GM.betStore.forEach(bet=> bet.confirm = true);

		} else if(flag === 'playedBets'){ // Подтвердить все ставки
			GM.betStore.forEach(bet=> bet.played = true);

		} else if(flag === 'findById'){ // Найти объект ставки по id
			return GM.betStore.find(item => item.id === rest[1]);

		} else if(flag === 'betSumm'){ // Сумма всех ставок
			let balance = 0;
			// Если у фишки значение баланса равно нулю, то удаляем её из массива фишек
			GM.betStore.forEach((bet, idx, array) => {
				bet.ctrl.balance ? balance += bet.ctrl.balance : array.splice(idx, 1);
			});
			return balance;
		} else if(flag === 'deleteBets'){ // Удалить ставки

			let deleteBets = [];
			if(rest[1] === 'confirm'){
				deleteBets = GM.betStore.filter(bet => bet.confirm);
				GM.betStore = GM.betStore.filter(bet => !bet.confirm);
			} else if(rest[1] === '!confirm'){
				deleteBets = GM.betStore.filter(bet => !bet.confirm);
				GM.betStore = GM.betStore.filter(bet => bet.confirm);
			} else if(rest[1] === 'played') {
				deleteBets = GM.betStore.filter(bet => bet.played);
				GM.betStore = GM.betStore.filter(bet => !bet.played);
			} else if(rest[1] === 'all'){
				deleteBets = GM.betStore.filter(bet => bet);
				GM.betStore.length = 0;
			}

			let animation = (rest[2] !== false);
			deleteBets.forEach(bet => deleteSomeBet(bet, animation));

		} else if(flag === 'x2'){ // Удвоение ставок
			let summ = this.betStoreInterface('betSumm');

			summ > betPanel.data.fldBalance ?
				errors.viewError(402) :
				GM.betStore.forEach(bet => bet.ctrl.updateBet( bet.ctrl.balance ));

		} else if(flag === 'lock'){ // Лочим/разлочиваем ставки
			GM.betStore.forEach(bet => bet.ctrl.lock( rest[1] ));

		} else if(flag === 'isEmpty'){ // Проверка на пустоту
			return !!GM.betStore.length

		} else if(flag === 'cancel'){
			if(GM.betStore.length){
				let idx = GM.betStore.length-1,
					cancelBet = GM.betStore[idx],
					animation = (rest[2] !== false);

				GM.betStore.splice(idx, 1);
				deleteSomeBet(cancelBet, animation);
			}
		}

		this.userData({
			fldBet: this.betStoreInterface('betSumm'),
			fldBalance: GM.data.fldBalance - this.betStoreInterface('betSumm')
		});
	}

	/**
	 * с флагом 'updateModel' - обновляем модель. Модель хранит последние данные с сервера
	 * без флага переданный объект обновляет верхнюю панель
	 */
	userData(...rest){
		let {componentCotrollers: cmpCtrl, gameModel: GM} = this,
			{betPanelCtrl: betPanel, buttons} = cmpCtrl,
			flag = rest[0];

		if(flag === 'updateModel'){
			for(let key in rest[1]) GM.data[key] = rest[1][key];
			betPanel.setData(rest[1]);
		} else {
			betPanel.setData(rest[0]);
		}

		buttons.lockClear( !GM.betStore.filter(bet => !bet.confirm).length );
		buttons.lockCancel(!GM.betStore.length);
	}


	/**
	 * ========================================== Управление игровым столом =========================================
	 */
	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	hideTableHints(){
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

			this.betStoreInterface();

		} else if(type === 'touchStart'){

			this.touchEvents.betStart = true;
			GM.touchBet = data;

		} else if(type === 'touchEnd'){

			GM.touchBet = undefined;
			GM.activeChip = undefined;
			this.touchEvents = 'reset';

		}
	}

	onTouchStart(event){
		this.touchCount++;
		this.debugW.addText('touchCount: '+this.touchCount, 0);

		// let intMan = this.game.renderer.plugins.interaction;
		// console.log('➠', intMan.interactiveDataPool);
	}

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
			this.fChip.setKoeff( obj && _hf.getClass(obj) === 'object' ? koeff[obj.numbers.length] : null );

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
		this.touchCount--;
		this.debugW.addText('touchCount: '+this.touchCount, 0);

		let {componentCotrollers: cmpCtrl, gameModel: GM} = this;

		let activeChip = GM.activeChip || cmpCtrl.chips.getActiveChipData();

		if(activeChip){
			let pos4Bet = this.getDataForBet(event.data.global, true);
			console.log('pos4Bet ➠ ', pos4Bet);

			// Если ячейка составная (Змейка)
			let value = Array.isArray(pos4Bet) ? activeChip.value*pos4Bet.length : activeChip.value;

			if(cmpCtrl.betPanelCtrl.data.fldBalance - value < 0){
				if(pos4Bet) cmpCtrl.errors.viewError(402);
			} else {
				this.changeBets(pos4Bet, activeChip.value);
			}
		}

		GM.activeChip = undefined;
		this.removeFloatChip();
		this.hideTableHints();
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
		this.betStoreInterface('deleteBets', '!confirm');

		this.prevBetsActive = false;
	};

	btnCancel(){
		this.betStoreInterface('cancel');
	}

	/**
	 * Событие кнопки "повторить ставки" (передаётся коллбеком)
	 */
	btnRepeat(){
		let {componentCotrollers: cmpCtrl} = this;

		// this.prevBets = '{"kind":"bets_msg",' +
		// 	'"bets":[' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[28,31]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[19]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[27]}},' +
		// 	'{"price":3000,"content":{"kind":"numbers","numbers":[7,10]}}' +
		// 	']}';

		if(this.prevBetsActive || !this.prevBets) return;

		let data = JSON.parse(this.prevBets);

		// Если сумма предыдущей ставки больше баланса - показываем 402 ошибку
		let value = 0;
		data.bets.forEach(item => value += item.price);

		if(cmpCtrl.betPanelCtrl.data.fldBalance - value > 0){
			this.setServerBets(data.bets);
			this.prevBetsActive = true;
		} else {
			cmpCtrl.errors.viewError(402);
		}
	};

	/**
	 * Событие кнопки "удвоить ставки" (передаётся коллбеком)
	 */
	btnX2(){
		this.betStoreInterface('x2');
	};

	/**
	 * Событие кнопки "BET" (передаётся коллбеком)
	 */
	betBtnClick(){
		let {gameModel: GM} = this;

		if(!this.betStoreInterface('isEmpty')) return false;

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
		let {componentCotrollers: cmpCtrl, stage: st} = this;

		status = !!status;

		st.interactive = status;

		for(let key in cmpCtrl){
			if(cmpCtrl.hasOwnProperty(key)){
				if(cmpCtrl[key].disable && status) cmpCtrl[key].enable();
				if(cmpCtrl[key].disable && !status) cmpCtrl[key].disable();
			}
		}

		this.betStoreInterface('lock', status);
	}
}