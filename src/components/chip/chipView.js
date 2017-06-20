import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore, gameSounds} from './../../constants/presets';
import settings from './settings';
import {_hf} from '../../services/helpFunctions';

export default class ChipView {
	constructor(config) {
		this.cfg = config;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		// spriteContainer.x = settings.position[chipType].x;
		// spriteContainer.y = settings.position[chipType].y;

		this._chips = {};
		// let sprite = new _pxS( spriteStore.chips[chipType] );

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			this._chips[item] =new _pxC();
			let _c = this._chips[item];

			_c.x = settings.position[item].x;
			_c.y = settings.position[item].y;

			// Opt-in to interactivity
			_c.interactive = true;
			// Shows hand cursor
			_c.buttonMode = true;

			let chipSprite = new _pxS( spriteStore.chips[item] );
			chipSprite.anchor.set(0.5);

			// Тень под фишкой
			let shadow = new _pxS( spriteStore.chips.chipShadow );
			shadow.anchor.set(0.5);

			// Значение ставки на фишке
			_c._chipValue = settings.values[item];
			_c._chipType = item;
			let chipValueText = new _pxT( _hf.formatChipValue(_c._chipValue), settings.textStyle );
			chipValueText.anchor.set(0.5);

			['touchend', 'mouseup', 'pointerup'].forEach((event)=>{
				_c.on(event, this.chipTouchEnd, this);
			});

			['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
				_c.on(event, this.chipTouchStart, this);
			});

			_c.addChild(shadow).addChild(chipSprite).addChild(chipValueText);

			this._spriteContainer.addChild(_c);
		});
	}

	get pixiSprite(){
		return this._spriteContainer;
	}

	set activeChip(chip){
		this._activeChip = chip
	}

	get activeChip(){
		return this._activeChip;
	}

	chipTouchEnd(event){
		// onClick в ChipController
		this.cfg.click.call(this.cfg.ctx, event, event.target._chipValue);
	}

	chipTouchStart(event){
		gameSounds.play('sound02');
		// chipTouchStart в ChipController
		this.cfg.touchStart.call(this.cfg.ctx, event.target._chipValue);
	}

	setActive(chip){
		this._activeChip = chip;

		chip.children.forEach((item) => {
			item.scale.x += 0.15;
			item.scale.y += 0.15;
		});
	}

	setDefault(chip){
		this._activeChip = undefined;

		chip.children.forEach((item) => {
			item.scale.x -= 0.15;
			item.scale.y -= 0.15;
		});
	}

	chipData(chip){
		return {value: chip._chipValue, type: chip._chipType};
	}

	disableChips(){
		for(let key in this._chips){
			let sp = this._chips[key];

			sp.interactive = false;
			sp.buttonMode = false;
			sp.alpha = 0.7;
		}
	}

	enableChips(){
		for(let key in this._chips){
			let sp = this._chips[key];

			sp.interactive = true;
			sp.buttonMode = true;
			sp.alpha = 1;
		}
	}
}
