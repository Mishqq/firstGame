import GameFieldView from './view';

export default class TimeScaleController {
	constructor() {

		this.view = new GameFieldView();

	}

	get pixiSprite(){
		return this.view.pixiContainer;
	}

	setTime(time){
		this.view.setTime(time);

		return this;
	}

	setState(state, addText){
		this.view.setState(state, addText);
	}

	start(){
		this.view.start();
	}
}
