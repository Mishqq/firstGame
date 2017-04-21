import historyView from './historyView';

export default class historyController {
	constructor(config, callbacks, bets) {
		// Конфиг, пришедший от контроллера выше
		this.historyView = new historyView(config, callbacks, bets || []);
	}

	get pixiSprite(){
		return this.historyView.getPixiSprite
	}

	play(){
		this.historyView.rollPlay();
	}
}
