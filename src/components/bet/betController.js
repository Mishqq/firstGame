import BetView from './betView';

export default class BetController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

		this._numbers = this.cfg.numbers;

		this._type = this.cfg.type;

		if(this.cfg.dozen) this._dozen = this.cfg.dozen;
		if(this.cfg.column) this._column = this.cfg.column;

		let config = {
			pos: configByGameCtrl.pos,
			touchStart: this.touchStart,
			updateBetModel: this.updateBetModel,
			touchEnd: this.onTouchEnd,
			ctx: this
		};

		this._betView = new BetView(config, configByGameCtrl.value);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	get balance(){
		return this._betView.balance;
	}

	get numbers(){
		return this._numbers;
	}

	get type(){
		return this._type;
	}

	get moreType(){
		return (this._dozen || this._column || undefined);
	}

	touchStart(event, betTouchStart){
		// betTouchStart в gameController
		this.cfg.touchStart.call(this.cfg.ctx, event, betTouchStart);
	}

	updateBetView(value){
		let limit = this.cfg.limits[ this._numbers.length ];

		if(value > 0 && this.balance === limit.max)
			return false;

		if(this.balance + value > limit.max)
			value = limit.max - this.balance;

		this._betView.updateBet(value);
	}

	/**
	 * Вызывается вьюхой
	 */
	updateBetModel(){
		if(this._betView.balance === 0){
			console.log('удаляем ставку');

			// метод deleteBet в gameController
			this.cfg.delBet.call(this.cfg.ctx, this);
		} else {
			console.log('апдейтим модель ставки');
		}
	}

	onTouchEnd(event){
		// метод setBet в gameController
		this.cfg.setBet.call(this.cfg.ctx, event);
	}

	getTopChipValue(){
		return this._betView.getTopChipValue();
	}

	disableMove(){
		this._betView.disableMove();
	}

	enableMove(){
		this._betView.enableMove();
	}

	clearBet(){
		this._betView.clearBet();
	}
}
