import ButtonView from './ButtonView';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';

export default class ButtonController {
	constructor() {
		const buttonsCallbackConfig = {
			btnCancel: {
				onClickCb: this.cancelBtnClick,
				ctx: this
			},
			btnClear: {
				onClickCb: this.clearBtnClick,
				ctx: this
			},
			btnRepeat: {
				onClickCb: this.repeatBtnClick,
				ctx: this
			},
			btnX2: {
				onClickCb: this.x2BtnClick,
				ctx: this
			}
		};

		this._buttons = [];

		for(let key in buttonsCallbackConfig){
			let btn = new ButtonView(key, buttonsCallbackConfig[key]);
			this._buttons.push(btn);
		}
	}

	get buttons(){
		return this._buttons
	}

	cancelBtnClick(){
		console.log('cancelBtnClick (ButtonController)');
	}

	clearBtnClick(){
		console.log('clearBtnClick (ButtonController)');
	}

	repeatBtnClick(){
		console.log('repeatBtnClick (ButtonController)');
	}

	x2BtnClick(){
		console.log('x2BtnClick (ButtonController)');
	}
}
