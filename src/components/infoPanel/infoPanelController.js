import infoPanelView from './infoPanelView';
import {defaultPanelData} from './infoPanelData';

export default class infoPanelController {
	constructor(dataFromGameCtrl) {
		this._infoPanel = new infoPanelView( dataFromGameCtrl || defaultPanelData );
	}

	get pixiSprite(){
		return this._infoPanel.sprite
	}

	updateInfoPanelView(data){
		this._infoPanel.update(data);
	}
}
