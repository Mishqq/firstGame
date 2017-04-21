import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {_hf} from './../../services/helpFunctions';

export default class FloatChipView {
	constructor(config) {
		this.cfg = config;

		this._value = config.value;

		// Контейнер для плавающей фишки
		this._floatChipsContainer = new _pxC();
		this._floatChipsContainer.x = 50;
		this._floatChipsContainer.y = 50;
		// this._floatChipsContainer.visible = false;
		this._floatChipsContainer.interactive = true;

		let chipType = presets.data.floatChipTypes[ config.value ];

		let floatChipSprite = new _pxS( presets.spriteStore.chips[chipType] );
		// floatChipSprite.visible = false;
		floatChipSprite.anchor.set(0.5);
		this._floatChipsContainer.addChild(floatChipSprite);

		// Значение на фишке
		let chipValueText = new _pxT( _hf.formatChipValue(config.value), presets.textStyles.floatChipTextStyle);
		// chipValueText.visible = false;
		this._floatChipsContainer.addChild(chipValueText);
		chipValueText.anchor.x = 0.5;
		chipValueText.anchor.y = 0.55;
	}

	/**
	 * Возвращает контейнер со спрайтами фишек, тенью и текстом
	 * @returns {PIXI.Container|*}
	 */
	get floatChipContainer(){
		return this._floatChipsContainer;
	}

	get value(){
		return this._value;
	}

	/**
	 * Установка позиции контейнера со спрайтом фишки
	 * @param pos - {x: Number, y: Number}
	 */
	setPosition(pos){
		this._floatChipsContainer.x = pos.x;
		this._floatChipsContainer.y = pos.y;
	}
}
