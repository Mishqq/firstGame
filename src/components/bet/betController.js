import BetView from './betView';
import {floatChipTypes} from './../../constants/chipValues';

export default class BetController {
	constructor(pos) {
		let config = {
			pos: pos,
			onClick: this.onClick,
			ctx: this
		};

		this._betView = new BetView(config);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	onClick(event){

	}
}
