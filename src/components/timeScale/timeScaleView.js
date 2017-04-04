import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';

export default class TimeScaleView {
	constructor(callbacks, config, statusText) {
		this.callbacks = callbacks;
		this.cfg = config;
		this.text = statusText;
		this.isRun = false;
		this.state = 0;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this.pixiContainer = spriteContainer;

		spriteContainer.x = presets.positions.timeScale.x;
		spriteContainer.y = presets.positions.timeScale.y;

		this.sprites = {};

		['timerBack', 'timerYellow', 'timerRed'].forEach((item) => {
			this.sprites[item] = new _pxS( presets.spriteStore.timer[item] );
			if(item === 'timerRed') this.sprites[item].visible = false;
			spriteContainer.addChild( this.sprites[item] );
		});

		let pixiText = new _pxT(statusText['status' + this.state], presets.textStyles.timeScale);
		pixiText.anchor.set(0.5);
		pixiText.x = spriteContainer.width/2;
		pixiText.y = -30;
		spriteContainer.addChild( pixiText );
		this.sprites.text = pixiText;
	}

	set pixiContainer(container){
		this._spriteContainer = container;
	}

	get pixiContainer(){
		return this._spriteContainer;
	}

	start(){
		// Если таймер уже запущен
		if(this.isRun) return false;

		this.isRun = true;

		this.setState(this.state = 0);

		this.timeScaleLoop();
	}

	pause(){
		this.isRun = false;
	}

	defaultState(){
		let width = this.sprites.timerBack.width,
			redLine = this.sprites.timerRed,
			yellowLine = this.sprites.timerYellow;

		redLine.visible = false;
		redLine.width = width;

		yellowLine.visible = true;
		yellowLine.width = width;
	}

	/**
	 * Функция анимации временной шкалы
	 */
	timeScaleLoop(){
		let cfg = this.cfg,
			sprites =  this.sprites,
			tsWidth = sprites.timerBack.width,
			redLine = sprites.timerRed,
			yellowLine = sprites.timerYellow,
			deltaX = tsWidth/(cfg.time*cfg.fps);

		// Функция шага уменьшения шкалы
		let tick = ()=>{
			if(yellowLine.width/tsWidth <= cfg.changeColorPer && !sprites.timerRed.visible){
				redLine.visible = true;
				yellowLine.visible = false;
			}

			if(redLine.width - deltaX <= 0){
				if(redLine.width - deltaX) redLine.width = 0;
				clearTimeout(this.timerId);
				this.lastTimeCb();
				return false;
			} else if(!this.isRun){
				console.log('Пауза ➠ ');
				return false;
			}

			redLine.width -= deltaX;
			yellowLine.width -= deltaX;
			this.timerId = setTimeout(tick, 1000/cfg.fps);
		};

		this.timerId = setTimeout(tick, 1000/cfg.fps);
	}

	/**
	 * Метод вызывает коллбек из gameCtrl для блокирования возможности ставок
	 * через заданное время после окончания времени на временной шкале
	 */
	lastTimeCb(){
		let cfg = this.cfg;
		this.setState('next');

		this.isRun = false;

		console.log('Последние ставки - ', cfg.lastTime, 'сек');
		setTimeout(()=>{
			this.setState('next');

			console.log('Лочим возможность ставок');

			if(this.callbacks) this.callbacks.disableCb.call(this.callbacks.ctx);
		}, cfg.lastTime*1000);
	}

	/**
	 * Состояние компонента
	 * @param state - [0-3] || 'next'/'prev'
	 */
	setState(state){
		this.state = (typeof(state) === 'number') ? state :
			(state === 'next') ? this.state+1 : this.state-1;

		if(state === 0) this.defaultState();

		this.sprites.text.text = this.text['status'+this.state];
	}
}
