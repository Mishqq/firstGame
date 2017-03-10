import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {floatChipTextStyle} from './../../constants/chipValues';

export default class FloatChipView extends PIXI.Sprite {
	constructor(config) {
		super();

		this.viewFloatChipCb = (config.viewFloatChip) ? config.viewFloatChip : undefined;
		this.setVisibilityCb = (config.setVisibility) ? config.setVisibility : undefined;
		this.setPositionCb = (config.setPosition) ? config.setPosition : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		this._floatChipsContainer = new PIXI.Container();
		this._floatChipsContainer.x = 50;
		this._floatChipsContainer.y = 50;
		this._floatChipsContainer.visible = false;

		['chipSm0', 'chipSm1', 'chipSm2', 'chipSm3', 'chipSm4'].forEach((chipType)=>{
			let floatChipSprite = new PIXI.Sprite( spritesStore.chips[chipType] );
			floatChipSprite.visible = false;
			floatChipSprite.anchor.set(0.5);
			this._floatChipsContainer.addChild(floatChipSprite);
		});

		// Значение на фишке
		let chipValueText = new PIXI.Text(';)', floatChipTextStyle);
		chipValueText.visible = false;
		this._floatChipsContainer.addChild(chipValueText);
		chipValueText.anchor.x = 0.5;
		chipValueText.anchor.y = 0.55;
	}

	get floatChipContainer(){
		return this._floatChipsContainer;
	}

	setText(text){
		// let chipValueText = new PIXI.Text( text, floatChipTextStyle );
	}

	viewFloatChip(type, text){
		this._floatChipsContainer.visible = true;
		this._floatChipsContainer.children[type].visible = true;

		this._floatChipsContainer.children[5].text = text;
		this._floatChipsContainer.children[5].visible = true;
	}

	setVisibility(){

	}

	setPosition(pos){
		this._floatChipsContainer.x = pos.x;
		this._floatChipsContainer.y = pos.y;
	}
}
