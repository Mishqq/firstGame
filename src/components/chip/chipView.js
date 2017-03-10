import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {chipValues, chipTextStyle} from './../../constants/chipValues';

export default class ChipView extends PIXI.Sprite {
	constructor(chipType, config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.onTouchStartCb = (config.chipTouchStartCb) ? config.chipTouchStartCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();

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
		let chipValueText = new PIXI.Text( this.formatChipValue(this.chipValue), chipTextStyle );
		chipValueText.anchor.set(0.5);

		sprite.on('tap', this.onClick, this);
		sprite.on('click', this.onClick, this);

		sprite.on('mousedown', this.chipTouchStart, this);
		sprite.on('touchstart', this.chipTouchStart, this);

		spriteContainer.addChild(shadow).addChild(sprite).addChild(chipValueText);

		return spriteContainer;
	}

	onClick(){
		if(this.onClickCb) {
			this.onClickCb.call(this.cbCtx, this.chipValue);
		} else {
			console.log('chipClickEvent (ChipView)', this.chipValue);
		}
	}

	chipTouchStart(){
		if(this.onTouchStartCb) {
			this.onTouchStartCb.call(this.cbCtx, this.formatChipValue(this.chipValue));
		} else {
			console.log('chipTouchStart (ChipView)', this.formatChipValue(this.chipValue));
		}
	}

	formatChipValue(value){
		let str = value;
		str = str.toString();
		return (str.length > 3) ? str.substring(0, 1) + 'K' : value;
	}
}
