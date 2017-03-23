import BetView from './betView';

export default class BetController {
	constructor(configByGameCtrl) {
		this.onTouchEndCb = (configByGameCtrl.onTouchEndCb) ?
			configByGameCtrl.onTouchEndCb : undefined;

		this.onTouchStartCb = (configByGameCtrl.onTouchStartCb) ?
			configByGameCtrl.onTouchStartCb : undefined;

		this.deleteBetCb = (configByGameCtrl.deleteBetCb) ?
			configByGameCtrl.deleteBetCb : undefined;

		this.cbCtx = (configByGameCtrl.ctx) ? configByGameCtrl.ctx : this;

		let config = {
			pos: configByGameCtrl.pos,
			onTouchStartCb: this.touchStart,
			updateBetModel: this.updateBetModel,
			onTouchEndCb: this.onTouchEnd,
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

	touchStart(price){

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
			this.deleteBetCb ?
				this.deleteBetCb.call(this.cbCtx, this) :
				console.log('betDelete (BetController)');
		} else {
			console.log('апдейтим модель ставки');
		}
	}

	onTouchEnd(event){
		this.onTouchEndCb ?
			this.onTouchEndCb.call(this.cbCtx, event) :
			console.log('betTouchEnd (BetController)');
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
