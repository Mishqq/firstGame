import GameFieldView from './timeScaleView';
import presets from './../../constants/presets';

export default class TimeScaleController {
	constructor(cfgFromGameCtrl) {
		this.cfg = cfgFromGameCtrl;

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
		// lockTable в gameController
		this.cfg.lockTable.call(this.cfg.ctx);
	}
}
