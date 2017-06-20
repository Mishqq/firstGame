import historyView from './historyView';

export default class historyController {
	constructor(bets) {
		// Конфиг, пришедший от контроллера выше
		this.historyView = new historyView();
		if(bets) this.historyView.setData(bets)
	}

	setData(bets){
		this.historyView.setData(bets)
	}

	get pixiSprite(){
		return this.historyView.getPixiSprite
	}

	setRollTime(time){
		this.historyView.setRollTime(time);
	}

	showRollAnim(status){
		this.historyView.showRollAnim(status);

		return this;
	}

	showRolledNum(num){
		this.historyView.viewRollResult(num);
	}
	hideRollResult(){
		this.historyView.hideRollResult();

		return this;
	}

	addNum(num, animate){
		this.historyView.addNum(num, animate);

		return this;
	}

	play(){
		this.historyView.rollPlay();
	}
}
