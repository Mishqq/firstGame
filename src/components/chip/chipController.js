import ChipView from './chipView';
import {transferFactory} from './../../servises/transferFactory'

export default class ChipController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			chipTouchStartCb: this.chipTouchStart,
			ctx: this
		};

		this._chips = [];

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			let chip = new ChipView(item, config);
			this._chips.push(chip);
		});
	}

	get chips(){
		return this._chips
	}

	onClick(price){
		console.log('chipClickEvent (ChipController)', price);
	}

	chipTouchStart(price){
		transferFactory.chipActive = true;
		transferFactory.chipValue = price;
		console.log('chipTouchStart (ChipController)', price);
	}
}
