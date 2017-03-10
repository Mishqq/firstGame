import PIXI from 'pixi.js';
import {defaultPositions} from './../../constants/defaultPositions';
import {clickAreas} from './gameFieldCellMap';

export default class GameFieldView extends PIXI.Sprite {
	constructor(config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();

		spriteContainer.x = defaultPositions.fields.big.x;
		spriteContainer.y = defaultPositions.fields.big.y;

		let sprite = new PIXI.Sprite.fromImage( './assets/images/table.png' );

		// Opt-in to interactivity
		sprite.interactive = true;
		// Shows hand cursor
		sprite.buttonMode = true;

		sprite.on('tap', this.onClick, this);
		sprite.on('click', this.onClick, this);

		sprite.on('mousedown', this.onTouchStart, this);
		sprite.on('touchstart', this.onTouchStart, this);

		spriteContainer.addChild(sprite);

		this.spriteContainer = spriteContainer;

		// this.devModeInteractiveAreas();

		return spriteContainer;
	}

	/**
	 * Функция отработки по клику
	 * @param event
	 */
	onClick(event){
		if(this.onClickCb) {
			this.onClickCb.call(this.cbCtx, event);
		} else {
			console.log('gameFieldClickEvent (ChipView)');
		}
	}

	/**
	 * Функция отработки по нажатию
	 * @param event
	 */
	onTouchStart(event){
		if(this.onTouchStartCb) {
			this.onTouchStartCb.call(this.cbCtx, this.chipValue);
		} else {
			console.log('gameFieldTouchStart (ChipView)');
		}
	}

	/**
	 * Отрисовка областей на поле для режима отладки
	 */
	devModeInteractiveAreas(){
		clickAreas.forEach((item)=>{
			this.drawRect(item);
		})
	}

	/**
	 * Добавление графики (прямоугольника) на сцену
	 */
	drawRect(area){
		let graphics = new PIXI.Graphics();

		graphics.beginFill(0xFFFFFF);
		graphics.alpha = 0.80;

		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(2, 0xFF0000);

		// draw a rectangle
		graphics.drawRect(area.x, area.y, area.w, area.h);

		if(area.c && area.c.length){
			let str = '';
			area.c.forEach((item)=>{
				str += item;
			});

			let text = new PIXI.Text(str);
			text.style.font = "bold 18px Arial";
			text.style.wordWrapWidth = 0;
			text.style.fill = 'white';
			text.style.stroke = 'black';
			text.style.strokeThickness = 5;
			text.rotation = -0.5;

			text.anchor.set(0.55);
			text.x = area.x + area.w/2;
			text.y = area.y + area.h/2;
			graphics.addChild(text);
		}

		this.spriteContainer.addChild(graphics);
	}
}
