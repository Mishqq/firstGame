import PIXI from 'pixi.js';
import {styles} from './../../constants/styles';
import {blockTexts} from './blockTexts';
import {spritesStore} from './../../spritesStore';

export default class hotNumView {
	constructor() {
		let texts = blockTexts.hotNumbers;

		this.colorMap = {
			bgRed: [1,3,5,7,9, 12,14,16,18, 19,21,23,25,27, 30,32,34,36],
			bgBlack: [2,4,6,8, 10,11,13,15,17, 20,22,24,26, 28,29,31,33,35],
		};

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this._spriteContainer = spriteContainer;

		texts.forEach((item) => {
			let newText = item.type === 'gradientText' ?
				new PIXI.extras.BitmapText(item.text, styles.infoPanel[item.type]) :
				new PIXI.Text(item.text, styles.infoPanel[item.type]);

			newText.position = {x: item.x || 0, y: item.y || 0};

			this._spriteContainer.addChild(newText);
		});

		let arr = [
			{number: 34, amount: 37},
			{number: 17, amount: 19},
			{number: 23, amount: 47},
			{number: 15, amount: 98}
			];

		this.createNumbers(arr);

		this.numbers.forEach((item) => {
			this._spriteContainer.addChild(item);
		});
	}

	get sprite(){
		return this._spriteContainer;
	}


	/**
	 * Метод создаёт массив PIXI-контейнеров с числами
	 * @param numbers
	 */
	createNumbers(numbers){
		if(!this.numbers) this.numbers = [];

		numbers.sort((a, b) => {return a.amount < b.amount});

		numbers.forEach((num, idx) => {
			let item = this.createNumber(num);
			item.position = {x: idx*75+20, y: 80};
			this.numbers.push(item);
		});
	}

	/**
	 * Метод создает PIXI-контейнер с полученными данными и возвращает его
	 * @param obj
	 * @returns {PIXI.Container}
	 */
	createNumber(obj){
		let color;
		for(let key in this.colorMap)
			if(~this.colorMap[key].indexOf(obj.number)) color = key;

		let numCnt = new PIXI.Container(),
			bg = new PIXI.Sprite( spritesStore.bgNumbers[color] ),
			text1 = new PIXI.Text(obj.number, {font: 'normal 30px Arial', fill: 'white'}),
			text2 = new PIXI.Text(obj.amount, {font: 'normal 26px Arial', fill: 'white'});

		text1.position = {x: 15, y: 15};
		text2.position = {x: 25, y: 70};

		numCnt.addChild(bg);
		numCnt.addChild(text1);
		numCnt.addChild(text2);

		return numCnt;
	}

	updateNumber(){

	}
}
