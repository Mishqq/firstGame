import BetView from './betView';

export default class BetController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

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

	touchStart(event, betTouchStart){
		// betTouchStart в gameController
		this.cfg.touchStart.call(this.cfg.ctx, event, betTouchStart);
	}

	updateBetView(value){
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
}
