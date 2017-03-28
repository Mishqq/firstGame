import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {chipValues} from './../../constants/chipValues';
import {styles} from './../../constants/styles';
import {_hf} from './../../servises/helpFunctions'

export default class ChipView {
	constructor(chipType, config) {
		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.chipTouchStartCb = (config.chipTouchStartCb) ? config.chipTouchStartCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;
		// Opt-in to interactivity
		spriteContainer.interactive = true;
		// Shows hand cursor
		spriteContainer.buttonMode = true;


		spriteContainer.x = defaultPositions.chips[chipType].x;
		spriteContainer.y = defaultPositions.chips[chipType].y;

		let sprite = new _pxS( spritesStore.chips[chipType] );


		sprite.anchor.set(0.5);

		// Тень под фишкой
		let shadow = new _pxS( spritesStore.chips.chipShadow );
		shadow.anchor.set(0.5);

		// Значение ставки на фишке
		this.chipValue = chipValues[chipType];
		this.chipType = chipType;
		let chipValueText = new _pxT( _hf.formatChipValue(this.chipValue), styles.chipTextStyle );
		chipValueText.anchor.set(0.5);

		['touchend', 'mouseup', 'pointerup'].forEach((event)=>{
			spriteContainer.on(event, this.chipTouchEnd, this);
		});

		['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
			spriteContainer.on(event, this.chipTouchStart, this);
		});

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

	chipTouchEnd(){
		this.onClickCb ?
			this.onClickCb.call(this.cbCtx, this.chipValue) :
			console.log('chipClickEvent (ChipView)', this.chipValue);
	}

	chipTouchStart(){
		this.chipTouchStartCb ?
			this.chipTouchStartCb.call(this.cbCtx, this.chipValue) :
			console.log('chipTouchMove (ChipView)', this.chipValue);
	}

	setActive(){
		this.active = true;

		this.sprite.children.forEach((childSprite)=>{
			childSprite.scale.x += 0.15;
			childSprite.scale.y += 0.15;
		});
	}

	setDefault(){
		this.active = false;

		this.sprite.children.forEach((childSprite)=>{
			childSprite.scale.x -= 0.15;
			childSprite.scale.y -= 0.15;
		});
	}

	chipData(){
		return {value: this.chipValue, type: this.chipType};
	}

	disableChip(){
		let sp = this._spriteContainer;

		sp.interactive = false;
		sp.buttonMode = false;
		sp.alpha = 0.7;
	}

	enableChip(){
		let sp = this._spriteContainer;

		sp.interactive = true;
		sp.buttonMode = true;
		sp.alpha = 1;
	}
}
