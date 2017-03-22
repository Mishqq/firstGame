import PIXI from 'pixi.js';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';
import {spritesStore} from './../../spritesStore';

export default class TimeScaleView {
	constructor(time) {
		this.time = time;
		this.actionStatus = false;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this.pixiContainer = spriteContainer;

		spriteContainer.x = defaultPositions.timeScale.x;
		spriteContainer.y = defaultPositions.timeScale.y;

		this.sprites = {};

		this.sprites.tsBg = new PIXI.Sprite( spritesStore.timer.timerBack );
		this.sprites.tsYellow = new PIXI.Sprite( spritesStore.timer.timerYellow );
		this.sprites.tsRed = new PIXI.Sprite( spritesStore.timer.timerRed );

		for(let sprite in this.sprites){
			this.sprites[sprite].anchor.set(0);
		}
		this.sprites.tsRed.visible = false;

		spriteContainer.addChild(this.sprites.tsBg);
		spriteContainer.addChild(this.sprites.tsYellow);
		spriteContainer.addChild(this.sprites.tsRed);
	}

	set pixiContainer(container){
		this._spriteContainer = container;
	}

	get pixiContainer(){
		return this._spriteContainer;
	}

	start(){
		// Если таймер уже запущен
		if(this.actionStatus) return false;

		this.actionStatus = true;
		this.timeScaleLoop();
	}

	pause(){
		this.actionStatus = false;
	}

	timeScaleLoop(){
		let _self = this,
			originWitdh = this.sprites.tsBg.width,
			fps = 60,
			deltaX = originWitdh/(this.time*fps),
			redLine = this.sprites.tsRed,
			yellowLine = this.sprites.tsYellow;


		this.timerId = setTimeout(function tick() {
			let width = yellowLine.width;

			let line = redLine.visible ? redLine : yellowLine;

			if(width/originWitdh <= 0.5 && !_self.sprites.tsRed.visible){
				line = redLine;
				redLine.width = width;
				redLine.visible = true;

				yellowLine.visible = false;
			}

			if(line.width - deltaX <= 0 || !_self.actionStatus){
				if(line.width - deltaX) line.width = 0;
				clearTimeout(_self.timerId);
				return false;
			} else {
				line.width -= deltaX;
				_self.timerId = setTimeout(tick, 1000/fps);
			}
		}, 1000/fps);
	}
}
