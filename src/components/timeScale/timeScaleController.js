import GameFieldView from './timeScaleView';

export default class TimeScaleController {
	constructor(cfgFromGameCtrl) {
		if(cfgFromGameCtrl){
			this.ctx = cfgFromGameCtrl.ctx ? cfgFromGameCtrl.ctx : undefined;
			this.blockBetCb = cfgFromGameCtrl.blockBetCb ? cfgFromGameCtrl.blockBetCb : undefined;
		}

		let time = 3;

		this._timeScale = new GameFieldView(time);
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
}
