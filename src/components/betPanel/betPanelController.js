import ButtonView from './betPanelView';

export default class betPanelController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;
	}

	get pixiSprite(){
		return 'lol'
	}
}
