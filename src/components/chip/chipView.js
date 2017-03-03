import PIXI from 'pixi.js';

export default class ChipView extends PIXI.Sprite {
	constructor() {
		super();

		// super(PIXI.Texture.fromFrame('./assets/images/chips.json'));
		// super(PIXI.resources["./assets/images/chips.json"].textures["chip0"]);

		// this.loadRes( this.createEnt );
		// this.anchor.set(0.5);
	}

	// loadRes(callback){
	// 	PIXI.loader.add(['./assets/images/ships.json',]).load(callback);
	// }
	//
	// createEnt(param, param2){
	//
	// }
}
