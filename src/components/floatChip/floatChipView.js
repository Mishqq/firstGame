import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settings from './settings';
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

		let chipType = settings.data[ config.value ];

		let floatChipSprite = new _pxS( spriteStore.chips[chipType] );
		// floatChipSprite.visible = false;
		floatChipSprite.anchor.set(0.5);
		this._floatChipsContainer.addChild(floatChipSprite);

		// Значение на фишке
		let chipValueText = new _pxT( _hf.formatChipValue(config.value), settings.textStyle);
		// chipValueText.visible = false;
		this._floatChipsContainer.addChild(chipValueText);
		chipValueText.anchor.x = 0.5;
		chipValueText.anchor.y = 0.55;

		this.koeffBubble = new _pxS( spriteStore.chips.chipCF );
		this.koeffBubble.anchor.set(0.5);
		this.koeffBubble.visible = false;
		this.koeffBubble.y = -65;
		this._floatChipsContainer.addChild(this.koeffBubble);

		// Значение коэффициента
		this.koeffText = new _pxT('', {font: "bold 30px Arial", fill: 0xFFE144, align: 'center'});
		this.koeffText.anchor.set(0.5);
		this.koeffText.y = -70;
		this._floatChipsContainer.addChild(this.koeffText);
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

	setKoeff(text){
		this.koeffText.text = text ? 'x' + text : '';
		this.koeffBubble.visible = !!text;
	}
}
