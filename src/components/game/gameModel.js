import settings from './settings'

export default class GameModel {
	constructor(){
		this._data = {fldBalance: 0, fldBet: 0, fldWin: 0, fldBonus: 0};

		this._betStore = [];
	}

	get betStore(){
		return this._betStore;
	}
	set betStore(newBetStore){
		this._betStore = newBetStore;
	}

	get data(){
		return this._data;
	}
	set data(newData){
		this._data = newData;
	}


	/**
	 * Сброс модели: обнуляем ставки и подтверждённые ставки
	 */
	resetModel(){
		this.activeChip = undefined;
		this.betTouchStart = false;
	}


	/**
	 * Генератор сообщения о ставках для fromJs
	 */
	fromJsMessage(){
		let msg = {kind: 'bets_msg', bets: []};
		this.betStore.forEach((bet) => {
			let item = bet.ctrl,
				obj = {price: item.balance, content: {kind: item.type}};

			if(item.type === 'dozen' || item.type === 'column') {
				obj.content[item.type] = item.moreType;
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

		this.betStore.forEach((bet) => {
			let item = bet.ctrl;
			if(~item.numbers.indexOf(winNum) && bet.confirm)
				winSum+= item.balance * _k[ item.numbers.length ];
		});

		return winSum;
	};
}