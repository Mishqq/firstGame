import PIXI from 'pixi.js';
import {styles} from './../../constants/styles';
import {blockTexts} from './blockTexts';


export default class limitsView {
	constructor() {
		let texts = blockTexts.limitBlock;

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
	}

	get sprite(){
		return this._spriteContainer;
	}
}
