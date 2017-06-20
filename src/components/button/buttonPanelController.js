import ButtonView from './buttonPanelView';

export default class ButtonController {
	constructor(cfgFromGameCtrl) {
		this._btnView = new ButtonView(cfgFromGameCtrl);
	}

	get pixiSprite(){
		return this._btnView.getPixiSprite
	}

	lockClear(lockStatus){
		return this._btnView.lockClear(lockStatus);
	}

	disable(){
		this._btnView.btnDisable();
	};

	enable(){
		this._btnView.btnAllDefault();
	};
}
