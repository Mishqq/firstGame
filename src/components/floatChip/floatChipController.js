import FloatChipView from './floatChipView';
import presets from './../../constants/presets';

export default class FloatChipController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

		this._floatChipsSprite = new FloatChipView({touchEnd: this.touchEnd, ctx: this});
	}

	get pixiSprite(){
		return this._floatChipsSprite.floatChipContainer
	}

	hideFloatChip(){
		this._floatChipsSprite.hideFloatChips();
	}

	touchEnd(event){
		// setBet в gameController
		this.cfg.setBet.call(this.cfg.ctx, event);
	}

	/**
	 * Вызываются из gameController
	 */
	viewFloatChip(value){
		this._floatChipsSprite.viewFloatChip(presets.data.floatChipTypes[value], value);
	}

	setPosition(pos){
		this._floatChipsSprite.setPosition(pos);
	}
}
