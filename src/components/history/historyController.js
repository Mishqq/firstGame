import historyView from './historyView';

export default class historyController {
	constructor(config, callbacks) {
		// Конфиг, пришедший от контроллера выше
		this.historyView = new historyView(config, callbacks);
	}

	get pixiSprite(){
		return this.historyView.getPixiSprite
	}

	play(){
		this.historyView.rollPlay();
	}
}
