import BetView from './betView';
import {floatChipTypes} from './../../constants/chipValues';

export default class BetController {
	constructor(configByGameCtrl) {
		this.onTouchEndCb = (configByGameCtrl.onTouchEndCb) ? configByGameCtrl.onTouchEndCb : undefined;
		this.cbCtx = (configByGameCtrl.ctx) ? configByGameCtrl.ctx : this;

		let config = {
			pos: configByGameCtrl.pos,
			onClick: this.onClick,
			updateBetModel: this.updateBetModel,
			onTouchEndCb: this.onTouchEnd,
			ctx: this
		};

		this._betView = new BetView(config, configByGameCtrl.value);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	onClick(event){

	}

	updateBetView(value){
		console.log('вызываем апдейт вьюхи', value);
		this._betView.updateBet(value);
	}

	updateBetModel(){
		console.log('апдейтим модель ставки');
	}

	onTouchEnd(event){
		this.onTouchEndCb ?
			this.onTouchEndCb.call(this.cbCtx, event) :
			console.log('betTouchEnd (BetController)');
	}
}
