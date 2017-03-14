import PIXI from 'pixi.js';
import {defaultPositions} from './../../constants/defaultPositions';
import {clickAreas, pointMap} from './gameFieldCellMap';
import {styles} from './../../constants/styles';

export default class GameFieldView extends PIXI.Sprite {
	constructor(config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.onHoverCb = (config.onHoverCb) ? config.onHoverCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this.pixiContainer = spriteContainer;

		spriteContainer.x = defaultPositions.fields.big.x;
		spriteContainer.y = defaultPositions.fields.big.y;

		let sprite = new PIXI.Sprite.fromImage( './assets/images/table.png' );

		// Opt-in to interactivity
		sprite.interactive = true;
		// Shows hand cursor
		sprite.buttonMode = true;

		['tap', 'click', 'pointertap'].forEach((event)=>{
			sprite.on(event, this.onClick, this);
		});

		['mousemove', 'touchmove', 'pointermove'].forEach((event)=>{
			sprite.on(event, this.hoverAreas, this);
		});

		spriteContainer.addChild(sprite);

		this.drawHints();

		// this.devModeInteractiveAreas();
	}

	set pixiContainer(container){
		this._spriteContainer = container;
	}

	get pixiContainer(){
		return this._spriteContainer;
	}

	/**
	 * Функция отработки по клику
	 * @param event
	 */
	onClick(event){
		this.onClickCb ?
			this.onClickCb.call(this.cbCtx, event) :
			console.log('gameFieldClickEvent (ChipView)');
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
	 * Отрисовка белых ховеров на поле.
	 */
	drawHints(){
		this.ringSprites = {};
		this.greenSquare = {};
		for(let key in pointMap){
			if(key === 'zero' || key === 'doubleZero') {
				this.drawGreenSquare(pointMap[key], key);
			} else {
				this.drawCircle(pointMap[key], key);
			}
		}

		for(let key in this.ringSprites)
			this.pixiContainer.addChild(this.ringSprites[key]);

		for(let key in this.greenSquare)
			this.pixiContainer.addChild(this.greenSquare[key]);

	};

	showHints(arr){
		arr.forEach((cellType)=>{
			cellType === 'zero' || cellType === 'doubleZero' ?
				this.showZeroSquare(cellType) :
				this.showCircles(cellType);
		})
	}

	hideHints(){
		for(let key in this.ringSprites)
			this.ringSprites[key].visible = false;

		for(let key in this.greenSquare)
			this.greenSquare[key].visible = false;
	}


	/**
	 * ================================= Подсветка нумерованых ячеек кольцами =============================
	 */
	drawCircle(obj, key){
		let ringSprite = new PIXI.Sprite.fromImage( './assets/images/ring.png' );
		ringSprite.anchor.set(0.5);
		ringSprite.x = obj.x;
		ringSprite.y = obj.y;
		ringSprite.visible = false;

		this.ringSprites[key] = ringSprite;
	};


	/**
	 * Функция скрытия белых колец
	 */
	hideCircles(){
		for(let key in this.ringSprites){
			this.ringSprites[key].visible = false;
		}
	}

	/**
	 * Функция показа белых колец
	 */
	showCircles(cellType){
		this.ringSprites[cellType].visible = true;
	}


	/**
	 * ==================================== Подсветка полей 0 и 00 ================================
	 */

	/**
	 * Отрисовка подсвечивающихся прямоугольников над 'zero' и 'doubleZero'
	 * @param obj
	 * @param key
	 */
	drawGreenSquare(obj, key){
		let graphics = new PIXI.Graphics();
		graphics.beginFill(0xABEE23);
		graphics.lineStyle(0);
		graphics.drawRect(obj.x, obj.y, obj.w, obj.h);
		graphics.alpha = 0.35;
		graphics.visible = false;
		this.pixiContainer.addChild(graphics);

		this.greenSquare[key] = graphics;
	}

	/**
	 * Подсвечиваем над 'zero' и 'doubleZero'
	 * @param arr
	 */
	showZeroSquare(cellType){
		this.greenSquare[cellType].visible = true;
	}

	/**
	 * Убираем подсветку над 'zero' и 'doubleZero'
	 */
	hideZeroSquare(){
		this.greenSquare.forEach((item)=>{
			item.visible = true;
		});
	}




	/**
	 * Наведение на интерактивные области игрового поля с
	 * подсветкой номеров, на которые мы производим ставку
	 * @param event
	 */
	hoverAreas(event){
		this.onHoverCb ?
			this.onHoverCb.call(this.cbCtx, event) :
			console.log('hoverAreas (ChipView)');
	}




	/**
	 * Добавление графики (прямоугольника) на сцену
	 */
	drawRect(area){
		let graphics = new PIXI.Graphics();

		graphics.beginFill(0xFFFFFF);
		graphics.alpha = 0.60;

		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(2, 0xFF0000);

		// draw a rectangle
		graphics.drawRect(area.x, area.y, area.w, area.h);

		if(area.c && area.c.length){
			let str = '';
			if(area.c.length > 2){
				str = area.c[0] + '...' + area.c[ area.c.length-1 ]
			} else {
				area.c.forEach((item)=>{ str += item });
			}


			let text = new PIXI.Text(str, styles.filedClickAreaTextStyle);
			text.rotation = -0.5;

			text.anchor.set(0.50);
			text.x = area.x + area.w/2;
			text.y = area.y + area.h/2;
			graphics.addChild(text);
		}

		this.pixiContainer.addChild(graphics);
	}
}
