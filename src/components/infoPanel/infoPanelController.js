import infoPanelView from './infoPanelView';

export default class infoPanelController {
	constructor() {
		this._infoPanel = new infoPanelView();
	}

	get pixiSprite(){
		return this._infoPanel.sprite
	}
}
