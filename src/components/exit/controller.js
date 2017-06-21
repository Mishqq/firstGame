import View from './view';

export default class Controller {

    constructor(config) {
        this.view = new View(config);
    }

	get pixiSprite(){
        return this.view.container;
    }

}