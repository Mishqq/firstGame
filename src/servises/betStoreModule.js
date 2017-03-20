class betModelClass{
	constructor(){
		this.bets = {};
		this.betsCtrl = {};

		this.proxy = new Proxy(this.bets, {
			get(target, prop) {
				console.log('`Чтение ${prop}` ➠ ', `Чтение ${prop}`);
				return target[prop];
			},
			set(target, prop, value) {
				console.log('`Запись ${prop} ${value}` ➠ ', `Запись ${prop} ${value}`);
				target[prop] = value;
				return true;
			}
		});
	}

	/**
	 * Коллекция ставок с привязкой к полям
	 * @param bets
	 */
	set bets(bets){
		// this.proxy = bets; - если захотим попроксировать
		this._bets = bets;
	}
	get bets(){
		// return this.proxy;
		return this._bets;
	}

	/**
	 * Коллекция ставок с привязкой к полям
	 * @param bets
	 */
	set betsCtrl(betsCtrl){
		this._betsCtrl = betsCtrl;
	}
	get betsCtrl(){
		return this._betsCtrl;
	}


	/**
	 * Текущая сумма ставок
	 * @param bet
	 */
	set currentBetSum(bet){
		this._currentBetSum = bet;
	}
	get currentBetSum(){
		return this._currentBetSum;
	}

	/**
	 * Очищаем все данные модели
	 */
	clearBets(){
		this.bets = [];
		this.currentBetSum = 0;
	}

	/**
	 * Добавление ставки
	 * @param bet - {field, bet}
	 */
	addBet(bet){
		this.bets[bet.field] = bet.value;
	}

	/**
	 * Удаление ставки
	 * @param field - название поля
	 */
	removeBet(field){
		this.bets[field] = undefined;
	}
}

let instance = new betModelClass();
Object.freeze(instance);

export {instance as betModel};
