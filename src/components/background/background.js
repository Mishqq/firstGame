import PIXI from 'pixi.js';

export default class Background extends PIXI.Sprite {
	constructor() {
		super(PIXI.Texture.fromImage('./assets/images/bg.jpg'));

		this.position.set(0, 0);
		this.anchor.set(0);
		this.width = 1920;
		this.height = 1080;
	}
}
