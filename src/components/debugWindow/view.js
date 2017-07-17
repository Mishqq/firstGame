import settings from './settings';
import {touchEvents} from './../../constants/presets';
import {Sprite, Container, Text} from "pixi.js"

export default class View {
	constructor() {
		/**
		 * Статус активности окна
		 * @type {boolean}
		 */
		this.debugWindowActive = false;

		/**
		 * Массив с объектами pixiText
		 * @type {Array}
		 */
		this.textStore = [];

		/**
		 * Счетчик тапов по триггеру.
		 * @type {number}
		 */
		this.triggerClickCounter = 0;

		let container = this.container = new Container();
		container.position = {x: 0, y: 0};

		/**
		 * Область, по которой надо тапнуть 10 раз менее чем за 3 секунды
		 */
		let trigger = new PIXI.Graphics();
		trigger.beginFill(0x3FEECA, 0)
			.drawRoundedRect(settings.trigger.x,
				settings.trigger.y,
				settings.trigger.w,
				settings.trigger.h, 10)
			.endFill();
		trigger.interactive = true;
		touchEvents.start.forEach(event=>trigger.on(event, this.switcher, this));

		container.addChild( trigger );
	}

	/**
	 * Функция добавления текста в debugWindow
	 * Если позиция не задана, то текст добавится в конец
	 * @param text - текст. Не сериализуется
	 * @param position - позиция, на которую надо добавить текст. Позиция отображается в дебаге
	 */
	addText(text, position){
		text = text.replace(/,"/gi, ', "');
		text = text.replace(/":"/gi, '": "');

		// Если на этой позиции есть текст, то прост апдейтим его
		if(this.textStore[position]){
			this.textStore[position].text = position + ': ' + text;

			// Смещаем существующие тексты
			this.textStore.forEach((someText, idx, arr) => {
				let prevObj = arr[idx-1];
				someText.y = prevObj ? prevObj.position.y + prevObj.height + 30 : 10;
			})

		} else {
			// Не мацать, работает
			let newText = new Text('', settings.textStyle);

			// Если позиции нет, то добавляем текс в конец массива.
			position !== undefined ?
				this.textStore[position] = newText :
				this.textStore.push(newText);

			// Номер для отрисовки индекса и вычисления предыдущего текста
			let num = position !== undefined ?
				position :
				this.textStore.length;

			newText.text = num + ': ' + text;

			// Отступ текста = координата "y" текста выше + его высота + 30 пикселей
			// Если на месте текста выше "undefined", то 40*индекс текущего текста
			let y = this.textStore[num - 1] ?
				this.textStore[num - 1].position.y + this.textStore[num - 1].height + 40 : 40*num+10;

			newText.position = {x: 20, y: y};
		}

		this.removeBackground();
		if(this.debugWindowActive) this.drawBackground();
	}


	/**
	 * Подложка под дебаг-текст
	 */
	drawBackground(){
		let height = 210;
		this.textStore.forEach(someText => height += someText.height);

		let debugWindow = this.debugWindow = new PIXI.Graphics();
		debugWindow.beginFill(0xFF3300)
			.lineStyle(1, 0x6AEEE6, 1)
			.beginFill(0x075158, 0.75)
			.drawRect(2, 0, settings.positions.w, height)
			.endFill();

		this.container.addChildAt( this.debugWindow, 0 );
	}

	removeBackground(){
		if(this.debugWindow) this.container.removeChild( this.debugWindow );
	}

	/**
	 * Очищаем весь текст
	 */
	clearText(){
		this.textStore.forEach(someText=>this.container.removeChild(someText));
		this.textStore.length = 0;
	}


	showDebugWindow(){
		this.textStore.forEach(someText => this.container.addChild(someText));
		this.drawBackground();
	}


	hideDebugWindow(){
		this.textStore.forEach(someText => this.container.removeChild(someText));
		this.removeBackground();
	}


	switcher(){
		this.triggerClickCounter++;

		if(this.triggerClickCounter >= 5){
			this.debugWindowActive = !this.debugWindowActive;
			this.debugWindowActive ? this.showDebugWindow() : this.hideDebugWindow();
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