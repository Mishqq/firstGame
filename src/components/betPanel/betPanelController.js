import betPanelView from './betPanelView';

export default class betPanelController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;

		this.betPanel = new betPanelView();
	}

	get pixiSprite(){
		return this.betPanel.getPixiSprite
	}

	updateInfoPanelView(newData){
		this.betPanel.updateNumbers(newData);
	}
}
