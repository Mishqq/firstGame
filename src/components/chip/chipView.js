import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {chipValues} from './../../constants/chipValues';
import {styles} from './../../constants/styles';
import {_hf} from './../../servises/helpFunctions'

export default class ChipView extends PIXI.Sprite {
	constructor(chipType, config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.onTouchStartCb = (config.chipTouchStartCb) ? config.chipTouchStartCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this._spriteContainer = spriteContainer;

		spriteContainer.x = defaultPositions.chips[chipType].x;
		spriteContainer.y = defaultPositions.chips[chipType].y;

		let sprite = new PIXI.Sprite( spritesStore.chips[chipType] );

		// Opt-in to interactivity
		sprite.interactive = true;
		// Shows hand cursor
		sprite.buttonMode = true;
		sprite.anchor.set(0.5);

		// Тень под фишкой
		let shadow = new PIXI.Sprite( spritesStore.chips.chipShadow );
		shadow.anchor.set(0.5);

		// Значение ставки на фишке
		this.chipValue = chipValues[chipType];
		let chipValueText = new PIXI.Text( _hf.formatChipValue(this.chipValue), styles.chipTextStyle );
		chipValueText.anchor.set(0.5);

		sprite.on('tap', this.onClick, this);
		sprite.on('click', this.onClick, this);

		sprite.on('mousedown', this.chipTouchStart, this);
		sprite.on('touchstart', this.chipTouchStart, this);

		spriteContainer.addChild(shadow).addChild(sprite).addChild(chipValueText);

		this.active = false;
	}

	get sprite(){
		return this._spriteContainer;
	}

	set active(active){
		this._active = active
	}

	get active(){
		return this._active;
	}

	onClick(){
		this.onClickCb ?
			this.onClickCb.call(this.cbCtx, this.chipValue) :
			console.log('chipClickEvent (ChipView)', this.chipValue);
	}

	chipTouchStart(){
		this.onTouchStartCb ?
			this.onTouchStartCb.call(this.cbCtx, this.chipValue) :
			console.log('chipTouchStart (ChipView)', this.chipValue);
	}

	setActive(){
		this.active = true;

		this.sprite.children.forEach((childSprite)=>{
			childSprite.scale.x += 0.15;
			childSprite.scale.y += 0.15;
		});
	}

	setDefault(){
		console.log('111 ➠ ', 111);
		this.active = false;

		this.sprite.children.forEach((childSprite)=>{
			childSprite.scale.x -= 0.15;
			childSprite.scale.y -= 0.15;
		});
	}
}
