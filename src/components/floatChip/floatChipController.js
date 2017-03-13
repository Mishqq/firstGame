import FloatChipView from './floatChipView';
import {floatChipTypes} from './../../constants/chipValues';

export default class FloatChipController {
	constructor() {
		let config = {
			viewFloatChip: this.viewFloatChip,
			setPosition: this.setPosition,
			ctx: this
		};

		this._floatChipsSprite = new FloatChipView(config);
	}

	get getFloatChipsSprite(){
		return this._floatChipsSprite.floatChipContainer
	}

	viewFloatChip(value){
		this._floatChipsSprite.viewFloatChip(floatChipTypes[value], value);
	}

	hideFloatChip(){
		this._floatChipsSprite.hideFloatChips();
	}

	setPosition(pos){
		this._floatChipsSprite.setPosition(pos);
	}
}
