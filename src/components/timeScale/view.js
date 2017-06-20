import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settings from './settings';

export default class TimeScaleView {
	constructor() {
		this.timerTime = settings.timeSetting.time;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this.pixiContainer = spriteContainer;

		spriteContainer.x = settings.position.x;
		spriteContainer.y = settings.position.y;

		// Полоски
		this.blackLine = new _pxS( spriteStore.timer.timerBack );
		spriteContainer.addChild(this.blackLine);

		this.redLine = new _pxS( spriteStore.timer.timerRed );
		this.redLine.visible = false;
		spriteContainer.addChild(this.redLine);

		this.yellowLine = new _pxS( spriteStore.timer.timerYellow );
		spriteContainer.addChild(this.yellowLine);


		// Текст над шкалой
		this.scaleText = new _pxT('', settings.textStyle);
		this.scaleText.anchor.set(0.5);
		this.scaleText.x = spriteContainer.width/2;
		this.scaleText.y = -20;

		spriteContainer.addChild( this.scaleText );
	}

	set pixiContainer(container){
		this._spriteContainer = container;
	}

	get pixiContainer(){
		return this._spriteContainer;
	}

	start(){
		this.setState(0);
		this.timeScaleLoop();
	}

	/**
	 * Функция анимации временной шкалы
	 */
	timeScaleLoop(){
		let cfg = settings.timeSetting,
			deltaX = this.blackLine.width/(this.timerTime*cfg.fps);

		// Функция шага уменьшения шкалы
		let tick = ()=>{
			if(this.yellowLine.width/this.blackLine.width <= cfg.changeColorPer && !this.redLine.visible){
				this.redLine.visible = true;
				this.yellowLine.visible = false;

				this.scaleText.text = settings.states[1].text;
			}

			if(this.redLine.width - deltaX <= 0){
				this.redLine.width = 0;
				this.scaleText.text = settings.states[2].text;

				clearTimeout(this.timerId);
				return false;
			}

			this.redLine.width -= deltaX;
			this.yellowLine.width -= deltaX;

			this.timerId = setTimeout(tick, 1000/cfg.fps);
		};

		this.timerId = setTimeout(tick, 1000/cfg.fps);
	}

	/**
	 * Состояние компонента
	 * @param state - [0-4] || 'next'/'prev'
	 */
	setState(state, addText){
		let width = this.blackLine.width * settings.states[state].scaleValue;
		this.redLine.width = width;
		this.yellowLine.width = width;

		let currState = settings.states[state];

		this.blackLine.visible = currState.scale;
		this.redLine.visible = currState.scale && (currState.scaleValue <= 0.25);
		this.yellowLine.visible = currState.scale && (currState.scaleValue >= 0.25);

		this.scaleText.text = addText ? currState.text + ' ' + addText : currState.text;
	}

	setTime(time){
		this.timerTime = time;

		this.timeScaleLoop();
	}
}
