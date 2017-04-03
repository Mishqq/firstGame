import betPanelView from './betPanelView';

export default class betPanelController {
	constructor(values) {
		this.betPanel = new betPanelView(values);
	}

	get pixiSprite(){
		return this.betPanel.getPixiSprite
	}

	updateInfoPanelView(newData){
		this.betPanel.updateNumbers(newData);
	}
}
