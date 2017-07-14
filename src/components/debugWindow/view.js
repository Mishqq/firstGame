import settings from './settings';
import {touchEvents} from './../../constants/presets';
import {Sprite, Container, Text} from "pixi.js"

export default class View {
	constructor() {
		this.debugWindowActive = false;
		this.textStore = [];

		let container = this.container = new Container();
		container.position = {x: 0, y: 0};

		// Область, по которой надо тапнуть 10 раз менее чем за 3 секунды
		let trigger = new PIXI.Graphics();
		trigger.beginFill(0x3FEECA, 0);
		trigger.drawRoundedRect(settings.trigger.x, settings.trigger.y, settings.trigger.w, settings.trigger.h, 10);
		trigger.endFill();
		trigger.interactive = true;

		this.triggerClickCounter = 0;

		touchEvents.start.forEach(event=>trigger.on(event, this.showDebugWindow, this));

		let debugWindow = this.debugWindow = new PIXI.Graphics();
		debugWindow.beginFill(0xFF3300);
		debugWindow.lineStyle(4, 0xffd900, 1);
		debugWindow.lineStyle(2, 0x1F0731, 1);
		debugWindow.beginFill(0x1F0731, 0.75);
		debugWindow.drawRoundedRect(0, 0, settings.positions.w, settings.positions.h, 10);
		debugWindow.endFill();

		container.addChild( trigger );
	}

	addText(text, position){
		text = text.replace(/,"/gi, ', "');
		text = text.replace(/":"/gi, '": "');

		if(this.textStore[position]){
			this.textStore[position].text = position + ': ' + text;

			this.textStore.forEach((someText, idx, arr) => {
				let dY = arr[idx - 1] ?
					arr[idx - 1].position.y + arr[idx - 1].height + 30 : 10;
				someText.y = dY;
			})

		} else {
			// Не мацать, работает
			let newText = new Text('', settings.textStyle);
			position !== undefined ? this.textStore[position] = newText : this.textStore.push(newText);
			let num = position !== undefined ? position : this.textStore.length;
			newText.text = num + ': ' + text;

			let topMargin = this.textStore[num - 1] ?
				this.textStore[num - 1].position.y + this.textStore[num - 1].height + 30 : 40*num;

			newText.position = {x: 20, y: 10 + topMargin};
		}

		this.debugWindow.height = 10;
		this.textStore.forEach(someText => {
			this.debugWindow.height += someText.height;
		});
		this.debugWindow.height += 200;


	}

	clearText(){
		this.textStore.forEach(someText=>this.container.removeChild(someText));
		this.textStore.length = 0;
	}


	showDebugWindow(){
		this.triggerClickCounter++;
		if(this.triggerClickCounter >= 5){
			if(this.debugWindowActive){
				this.container.removeChild( this.debugWindow );
				this.textStore.forEach(someText => this.container.removeChild(someText));
				//this.textStore.length = 0;
			} else {
				this.container.addChild( this.debugWindow );
				this.textStore.forEach(someText => this.container.addChild(someText));
			}
			this.debugWindowActive = !this.debugWindowActive;
			this.triggerClickCounter = 0;
		}

		if(!this.timeoutId){
			this.timeoutId = setTimeout(() => {
				this.triggerClickCounter = 0;
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}, 3000)
		}
	}
}