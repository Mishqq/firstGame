import PIXI from 'pixi.js';

export default class GameController {
	constructor(){

	}

	chipClick(data){
		console.log('This is chipClick from controller', data, this);
	}

	cancelBtnClick(){
		console.log('This is cancelBtnClick from controller', this);
	}

	clearBtnClick(){
		console.log('This is clearBtnClick from controller', this);
	}

	x2BtnClick(){
		console.log('This is x2BtnClick from controller', this);
	}

	repeatBtnClick(){
		console.log('This is repeatBtnClick from controller', this);
	}
}