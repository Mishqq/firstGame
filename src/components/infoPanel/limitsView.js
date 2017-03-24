import PIXI from 'pixi.js';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';


export default class limitsView {
	constructor(config) {
		// this.callback = (config.callback) ? config.callback : undefined;
		// this.ctx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this._spriteContainer = spriteContainer;
	}

	get sprite(){
		return this._spriteContainer;
	}

	set active(active){
		this._active = active
	}

	chipTouchEnd(){
		this.callback ?
			this.callback.call(this.ctx) :
			console.log('limitsView');
	}
}
