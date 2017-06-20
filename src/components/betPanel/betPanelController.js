import betPanelView from './betPanelView';

export default class betPanelController {
	constructor(values) {
		this.betPanel = new betPanelView();
		if(values) this.setData(values);
	}

	setData(data){
		this.betPanel.setData(data);
	}

	get pixiSprite(){
		return this.betPanel.getPixiSprite
	}

	updateInfoPanelView(newData){
		this.betPanel.updateNumbers(newData);
	}

	get data(){
		return this.betPanel.data;
	}
}
