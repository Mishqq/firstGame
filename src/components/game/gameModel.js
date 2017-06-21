import settings from './settings'

export default class GameModel {
	constructor(){
		this._betsCtrls = {};
		this.componentsControllers = {};
		this._confirmBets = [];

		this._balance = 0;
	}



	get betsCtrl(){
		return this._betsCtrls;
	}
	set betsCtrl(newBetsCtrl){
		this._betsCtrls = newBetsCtrl;
	}

	get balance(){
		return this._balance;
	}
	set balance(newBalance){
		this._balance = newBalance;
	}

	deleteBetsCtrl(){
		this.betsCtrl = {};
	}
	get isEmptyBetsCtrl(){
		let isEmpty = true;

		for(let key in this.betsCtrl)
			if(this.betsCtrl[key]) isEmpty = false;

		return isEmpty;
	}



	get confirmBets(){
		return this._confirmBets;
	}
	set confirmBets(confirmBets){
		this._confirmBets = confirmBets;
	}
	calculateConfirmBets(){
		for(let key in this.betsCtrl){
			let bet = this.betsCtrl[key];

			let obj = {numbers: bet.numbers, balance: bet.balance, type: bet.type};
			if(bet.moreType) obj[bet.type] = bet.moreType;

			this.confirmBets.push(obj);
		}
	}
	deleteConfirmBets(){
		this.confirmBets.length = 0;
	}


	/**
	 * Сброс модели: обнуляем ставки и подтверждённые ставки
	 */
	resetModel(){
		this.activeChip = undefined;
		this.betTouchStart = false;
		this.deleteConfirmBets();
		this.deleteBetsCtrl();
	}


	/**
	 * Генератор сообщения о ставках для fromJs
	 */
	fromJsMessage(){
		let _cfb = this.confirmBets;

		let msg = {kind: 'bets_msg', bets: []};
		_cfb.forEach((item) => {
			let obj = {price: item.balance, content: {kind: item.type}};

			if(item.type === 'dozen' || item.type === 'column') {
				obj.content[item.type] = item[item.type];
			} else if(item.type === 'numbers'){
				obj.content.numbers = item.numbers;
			}
			msg.bets.push(obj)
		});

		return JSON.stringify(msg);
	}


	/**
	 * Рассчёт выигрыша
	 */
	calculateWin(winNum){
		let _k = settings.coefficients, winSum = 0;

		this.confirmBets.forEach((item) => {
			if(~item.numbers.indexOf(winNum)) winSum+= item.balance * _k[ item.numbers.length ];
		});

		return winSum;
	};
}