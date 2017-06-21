import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settigns from './settings';
import {_hf} from '../../services/helpFunctions';

export default class betPanelView {
	constructor() {
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		this._data = {};

		spriteContainer.position = settigns.position.main;

		let textSprites = {},
			texts = settigns.texts;
		for(let key in texts) {
			textSprites[key] = new _pxT(texts[key].text, settigns.textStyle);
			textSprites[key].position = texts[key].pos;
			spriteContainer.addChild(textSprites[key]);
		}

		this.fieldSprites = {};
		this.numSprites = {};
		for(let key in settigns.position.fields) {
			this.fieldSprites[key] = new _pxS( spriteStore.fields[key] );
			this.fieldSprites[key].position = settigns.position.fields[key];

			this.numSprites[key] = new _pxT(_hf.formatLimit(0), settigns.textStyle);
			this.numSprites[key].anchor.set(0, 0.5);
			this.numSprites[key].position = settigns.position.numbers[key];
			this.fieldSprites[key].addChild(this.numSprites[key]);

			this._spriteContainer.addChild(this.fieldSprites[key]);
		}
	};

	setData(data){
		this.data = data;

		for(let key in data)
			this.numSprites[key].text = _hf.formatLimit(data[key]);
	}

	get data(){
		return this._data;
	}

	set data(data){
		for(let key in data)
			this._data[key] = data[key];
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}
}
