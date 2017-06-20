import infoPanelView from './infoPanelView';

export default class infoPanelController {
	constructor(dataFromGameCtrl) {
		this._infoPanel = new infoPanelView( dataFromGameCtrl );
	}

	get pixiSprite(){
		return this._infoPanel.sprite
	}

	updateInfoPanelView(data){
		this._infoPanel.update(data);
	}
}
