import PIXI from 'pixi.js';

export default class Background extends PIXI.Sprite {
	constructor() {
		super(PIXI.Texture.fromImage('./assets/images/bg.jpg'));

		this.position.set(0, 0);
		this.anchor.set(0);
		// this.scale.x = 1;
		this.width = 1980;
		this.height = 1024;
		// this.scale.y = 0.5;
	}
}
