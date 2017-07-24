import ButtonView from './view';

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

	lockCancel(lockStatus){
		return this._btnView.lockCancel(lockStatus);
	}

	disable(){
		this._btnView.btnDisable();
	};

	enable(){
		this._btnView.btnAllDefault();
	};
}
