import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settigns from './settings';
import {_hf} from '../../services/helpFunctions';

export default class betPanelView {
	constructor(values) {
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		this._data;

		spriteContainer.position = settigns.position.main;

		let textSprites = {},
			texts = settigns.texts;
		for(let key in texts) {
			textSprites[key] = new _pxT(texts[key].text, settigns.textStyle);
			textSprites[key].position = texts[key].pos;
			spriteContainer.addChild(textSprites[key]);
		}
	};

	setData(data){
		this.data = data;

		this.numSprites = {};
		let fieldSprites = {},
		pos = settigns.position;
		for(let key in pos.fields) {
			fieldSprites[key] = new _pxS( spriteStore.fields[key] );
			fieldSprites[key].position = pos.fields[key];

			this.numSprites[key] = new _pxT(_hf.formatLimit(data[key]), settigns.textStyle);
			this.numSprites[key].anchor.set(0, 0.5);
			this.numSprites[key].position = pos.numbers[key];
			fieldSprites[key].addChild(this.numSprites[key]);

			this._spriteContainer.addChild(fieldSprites[key]);
		}
	}

	get data(){
		return this._data;
	}

	set data(data){
		this._data = data;
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}

	/**
	 * newData - {fldBet, fldWin, fldBalance}
	 * @param newData
	 */
	updateNumbers(newData){
		for(let key in newData){
			this.numSprites[key].text = _hf.formatLimit(newData[key]);
			this.data[key] = newData[key];
		}

	}
}
