import BetView from './betView';
import {floatChipTypes} from './../../constants/chipValues';

export default class BetController {
	constructor(pos, value) {
		let config = {
			pos: pos,
			onClick: this.onClick,
			updateBetModel: this.updateBetModel,
			ctx: this
		};

		this._betView = new BetView(config, value);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	onClick(event){

	}

	updateBetView(value){
		console.log('вызываем апдейт вьюхи');
		this._betView.updateBet(value);
	}

	updateBetModel(){
		console.log('апдейтим модель ставки');
	}
}
