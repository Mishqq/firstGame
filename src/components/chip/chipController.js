import ChipView from './chipView';
import {chipValues} from './../../constants/chipValues';
import {transferFactory} from './../../servises/transferFactory'

export default class ChipController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			chipTouchStartCb: this.chipTouchStart,
			ctx: this
		};

		this._chips = {};

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			let chip = new ChipView(item, config);
			this._chips[item] = chip;
		});
	}

	get chips(){
		return this._chips
	}

	onClick(price){
		console.log('chipClickEvent (ChipController)', price);
	}

	chipTouchStart(price){
		let chipType;
		for(let key in chipValues)
			if(chipValues[key] === price) chipType = key;

		transferFactory.activeChip = {
			value: price,
			type: chipType
		};

		for(let key in this.chips){
			if(this.chips[key].active) {
				this.chips[key].setDefault();
			}
		}

		this.chips[chipType].setActive();

		// console.log('chipTouchStart (ChipController)', price);
	}
}
