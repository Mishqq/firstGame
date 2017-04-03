import infoPanelView from './infoPanelView';
import presets from './../../constants/presets';

export default class infoPanelController {
	constructor(dataFromGameCtrl) {
		this._infoPanel = new infoPanelView( dataFromGameCtrl || presets.data.infoPanel );
	}

	get pixiSprite(){
		return this._infoPanel.sprite
	}

	updateInfoPanelView(data){
		this._infoPanel.update(data);
	}
}
