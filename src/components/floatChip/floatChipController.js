import FloatChipView from './floatChipView';
import presets from './../../constants/presets';

export default class FloatChipController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

		this._floatChipsSprite = new FloatChipView({value: this.cfg.value});
	}

	get pixiSprite(){
		return this._floatChipsSprite.floatChipContainer
	}

	get value(){
		return this._floatChipsSprite.value;
	}

	setPosition(pos){
		this._floatChipsSprite.setPosition(pos);
	}
}
