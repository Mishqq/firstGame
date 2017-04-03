import FloatChipView from './floatChipView';
import presets from './../../constants/presets';

export default class FloatChipController {
	constructor(configByGameCtrl) {
		this.onTouchEndCb = (configByGameCtrl.onTouchEndCb) ? configByGameCtrl.onTouchEndCb : undefined;
		this.cbCtx = (configByGameCtrl.ctx) ? configByGameCtrl.ctx : this;

		let config = {
			viewFloatChip: this.viewFloatChip,
			setPosition: this.setPosition,
			onTouchEndCb: this.onTouchEnd,
			ctx: this
		};

		this._floatChipsSprite = new FloatChipView(config);
	}

	get getFloatChipsSprite(){
		return this._floatChipsSprite.floatChipContainer
	}

	viewFloatChip(value){
		this._floatChipsSprite.viewFloatChip(presets.data.floatChipTypes[value], value);
	}

	hideFloatChip(){
		this._floatChipsSprite.hideFloatChips();
	}

	setPosition(pos){
		this._floatChipsSprite.setPosition(pos);
	}

	onTouchEnd(event){
		this.onTouchEndCb ?
			this.onTouchEndCb.call(this.cbCtx, event) :
			console.log('floatChipTouchEnd (FloatChipController)');
	}
}
