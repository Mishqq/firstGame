import PIXI from 'pixi.js';
import {defaultPositions} from './../../constants/defaultPositions';
import {clickAreas} from './gameFieldBigCellMap';

export default class GameFiledBigView extends PIXI.Sprite {
	constructor(callback, ctx) {
		super();

		this.onClickCb = (callback) ? callback : undefined;
		this.cbCtx = (ctx) ? ctx : this;

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

		spriteContainer.addChild(sprite);

		this.spriteContainer = spriteContainer;

		// this.devModeInteractiveAreas();

		return spriteContainer;
	}

	onClick(event){
		if(this.onClickCb) {
			this.onClickCb.call(this.cbCtx, event);
		} else {
			console.log('this default click on game field (big) sprite');
		}
	}

	/**
	 * Отрисовка областей на поле
	 */
	devModeInteractiveAreas(){
		clickAreas.forEach((item)=>{
			this.drawRect(item);
		})
	}

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
			// text.pivot.x = 0.5;
			text.x = area.x + area.w/2;
			text.y = area.y + area.h/2;
			graphics.addChild(text);
		}

		this.spriteContainer.addChild(graphics);
	}
}
