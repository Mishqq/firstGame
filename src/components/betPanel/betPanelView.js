import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {_hf} from '../../services/helpFunctions';

export default class betPanelView {
	constructor(values) {
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.position = presets.positions.betPanel.main;

		let textSprites = {},
			texts = presets.texts.betPanel;
		for(let key in texts) {
			textSprites[key] = new _pxT(texts[key].text, presets.textStyles.betPanel);
			textSprites[key].position = texts[key].pos;
			spriteContainer.addChild(textSprites[key]);
		}

		this.numSprites = {};
		let fieldSprites = {},
			pos = presets.positions.betPanel;
		for(let key in pos.fields) {
			fieldSprites[key] = new _pxS( presets.spriteStore.fields[key] );
			fieldSprites[key].position = pos.fields[key];

			this.numSprites[key] = new _pxT(_hf.formatLimit(values[key]), presets.textStyles.betPanel);
			this.numSprites[key].anchor.set(0, 0.5);
			this.numSprites[key].position = pos.numbers[key];
			fieldSprites[key].addChild(this.numSprites[key]);

			spriteContainer.addChild(fieldSprites[key]);
		}
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}

	/**
	 * newData - {fldBet, fldWin, fldBalance}
	 * @param newData
	 */
	updateNumbers(newData){
		for(let key in newData)
			this.numSprites[key].text = _hf.formatLimit(newData[key]);
	}
}
