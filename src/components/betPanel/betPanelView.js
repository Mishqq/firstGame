import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';

export default class ButtonView {
	constructor(values) {
		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}
}
