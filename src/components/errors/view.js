import settings from './settings';
import {Sprite, Container, Text} from "pixi.js"
import {TweenMax, Power2, TimelineLite} from "gsap";

export default class View {
	constructor() {
		this.init();
	}

	init(){
		let pos = settings.positions;
		let container = this.container = new Container();
		container.position = {x: pos.x, y: pos.y + 70};
		this.container = container;

		let graphics = new PIXI.Graphics();

		// set a fill and line style
		graphics.beginFill(0xFF3300);
		graphics.lineStyle(4, 0xffd900, 1);

		// draw a rounded rectangle
		graphics.lineStyle(1, 0xEE1324, 0);
		graphics.beginFill(0x000000, 0.15);
		graphics.drawRoundedRect(3, 3, pos.w + 3, pos.h + 3, 10);
		graphics.endFill();

		// draw a rounded rectangle
		graphics.lineStyle(1, 0xEE1324, 0);
		graphics.beginFill(0xEE1324, 0.85);
		graphics.drawRoundedRect(0, 0, pos.w, pos.h, 10);
		graphics.endFill();

		this.errorText = new Text('', settings.textStyle);
		this.errorText.position = {x: pos.w/2, y: pos.h/2};
		this.errorText.anchor.set(0.5, 0.5);

		container.addChild(graphics);
		container.addChild(this.errorText);
	}

	viewError(error, hideFlag){
		let pos = settings.positions;

		this.errorText.text = error;

		let tween =  new TimelineLite();
		tween.to(this.container, 1, {y: pos.y});

		if(!hideFlag){
			setTimeout(() => {
				this.isActive = false;
				tween.to(this.container, 1, {y: pos.y + 70, onComplete: ()=>this.errorText.text=''});
			}, 5000)
		}

	}
}