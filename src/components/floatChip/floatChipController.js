import FloatChipView from './floatChipView';
import {transferFactory} from './../../servises/transferFactory'

export default class FloatChipController {
	constructor() {
		let config = {
			viewFloatChip: this.viewFloatChip,
			setVisibility: this.setVisibility,
			setPosition: this.setPosition,
			ctx: this
		};

		this._floatChipsSprite = new FloatChipView(config);
	}

	get getFloatChipsSprite(){
		return this._floatChipsSprite.floatChipContainer
	}

	viewFloatChip(value){
		// let type(value)
		let type;
		switch(value) {
			case 100:
				type = 0;
				break;
			case 500:
				type = 1;
				break;
			case '1K':
				type = 2;
				break;
			case '2K':
				type = 3;
				break;
			case '3K':
				type = 4;
				break;
			default:
				break;
		}

		this._floatChipsSprite.viewFloatChip(type, value);
	}

	setVisibility(visibility){
		console.log('setVisibility (FloatChipController)', visibility);
	}

	setPosition(pos){
		this._floatChipsSprite.setPosition(pos);
	}
}
