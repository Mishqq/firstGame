import View from './view';

export default class Controller {
	constructor() {
		this.view = new View();
	}

	get pixiSprite(){
		return this.view.container;
	}

	addText(text, pos){
		this.view.addText(text, pos);
		return this;
	}

	clearText(idx){
		this.view.clearText(idx);
		return this;
	}

}