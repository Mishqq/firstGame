import {_p, _pxC, _pxS, _pxT, _pxG, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {clickAreas, pointMap, winHintPos} from './gameFieldCellMap';
import {TweenMax, Power2, TimelineLite} from "gsap";

export default class GameFieldView {
	constructor(config) {
		this.cfg = config;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this.pixiContainer = spriteContainer;

		spriteContainer.x = presets.positions.fields.big.x;
		spriteContainer.y = presets.positions.fields.big.y;

		// Opt-in to interactivity
		spriteContainer.interactive = true;
		// Shows hand cursor
		spriteContainer.buttonMode = true;

		['tap', 'click', 'pointertap'].forEach((event)=>{
			spriteContainer.on(event, this.onClick, this);
		});

		['mousemove', 'touchmove', 'pointermove'].forEach((event)=>{
			spriteContainer.on(event, this.hoverAreas, this);
		});

		let sprite = new _pxS.fromImage( './assets/images/table.png' );

		spriteContainer.addChild(sprite);

		this.drawHints();

		this.drawWinHints();

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
		this.cfg.click.call(this.cfg.ctx, event);
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
			if(+key === 0 || +key === 37) {
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
			cellType === 0 || cellType === 37 ?
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
		let ringSprite = new _pxS.fromImage( './assets/images/ring.png' );
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
		let graphics = new _pxG();
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
	 * Отрисовка графики выйгрышных номеров
	 */
	drawWinHints(){
		this.winNumHints = {};

		for(let key in winHintPos){
			let graphics = new _pxG();

			graphics.alpha = 1;
			graphics.lineStyle(8, 0xFFEF50);

			let {x,y,w,h} = winHintPos[key];

			graphics.drawRect(x, y, w, h);
			graphics.visible = false;

			this.pixiContainer.addChild(graphics);

			this.winNumHints[key] = graphics;
		}
	}

	showWinHunHint(key){
		this.activeWinHint = this.winNumHints[key];
		this.winNumHints[key].visible = true;

		// let tween = new TweenMax(this.winNumHints[key], 0.5, {alpha: 0.3, repeat: 20});
		let tween = new TweenMax(this.winNumHints[key], 0.3, {alpha: 0.4, repeat: 20, yoyo: true});
	}

	hideWinHint(){
		if(this.activeWinHint){
			this.activeWinHint.visible = false;
			this.activeWinHint = undefined;
		} else {
			for(let key in this.winNumHints){
				this.winNumHints[key].visible = false;
			}
		}
	}


	/**
	 * Наведение на интерактивные области игрового поля с
	 * подсветкой номеров, на которые мы производим ставку
	 * @param event
	 */
	hoverAreas(event){
		this.cfg.hover.call(this.cfg.ctx, event);
	}


	disableField(){
		this.pixiContainer.interactive = false;
	}

	enableField(){
		this.pixiContainer.interactive = true;
	}


	/**
	 * Добавление графики (прямоугольника) на сцену
	 */
	drawRect(area){
		let graphics = new _pxG();

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


			let text = new _pxT(str, presets.textStyles.filedClickAreaTextStyle);
			text.rotation = -0.5;

			text.anchor.set(0.50);
			text.x = area.x + area.w/2;
			text.y = area.y + area.h/2;
			graphics.addChild(text);
		}

		this.pixiContainer.addChild(graphics);
	}
}
