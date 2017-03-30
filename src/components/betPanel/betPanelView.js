import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {betPanelText, fields, numbers} from './betPanelData';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';
import {_hf} from './../../servises/helpFunctions';

export default class betPanelView {
	constructor(values) {
		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.position = defaultPositions.betPanel;

		let textSprites = {};
		for(let key in betPanelText) {
			textSprites[key] = new _pxT(betPanelText[key].text, styles.betPanel);
			textSprites[key].position = betPanelText[key].pos;
			spriteContainer.addChild(textSprites[key]);
		}

		this.numSprites = {};
		let fieldSprites = {};
		for(let key in fields) {
			fieldSprites[key] = new _pxS( spritesStore.fields[key] );
			fieldSprites[key].position = fields[key];

			this.numSprites[key] = new _pxT(_hf.formatLimit(0), styles.betPanel);
			this.numSprites[key].anchor.set(0, 0.5);
			this.numSprites[key].position = numbers[key];
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
