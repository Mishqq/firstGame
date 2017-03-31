import historyView from './historyView';

export default class historyController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;

		this.historyView = new historyView(cfgFromGameCtrl);
	}

	get pixiSprite(){
		return this.historyView.getPixiSprite
	}

	play(){
		this.historyView.rollPlay();
	}
}
