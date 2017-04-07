import betButtonView from './betButtonView';

export default class betButtonController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;

		this.btn = new betButtonView();
	}

	get pixiSprite(){
		return this.btn.getPixiSprite;
	}

	disable(){
		return this.btn.disable();
	}

	enable(){
		return this.btn.enable();
	}

	click(){

	}
}
