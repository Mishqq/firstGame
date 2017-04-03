import GameFieldView from './timeScaleView';
import presets from './../../constants/presets';

export default class TimeScaleController {
	constructor(cfgFromGameCtrl) {
		if(cfgFromGameCtrl){
			this.ctx = cfgFromGameCtrl.ctx ? cfgFromGameCtrl.ctx : undefined;
			this.disableCb = cfgFromGameCtrl.disableCb ? cfgFromGameCtrl.disableCb : undefined;
		}

		let cbForView = {
			disableCb: this.endTime,
			ctx: this,
		};

		this._timeScale = new GameFieldView(cbForView, presets.settings.timeScale, presets.texts.timeScale);
	}

	get pixiSprite(){
		return this._timeScale.pixiContainer;
	}

	start(){
		this._timeScale.start();
	}

	pause(){
		this._timeScale.pause();
	}

	endTime(){
		this.disableCb ?
			this.disableCb.call(this.ctx) :
			console.log('chipClickEvent (ChipView)');
	}
}
