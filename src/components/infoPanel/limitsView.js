import {_pxC, _pxT, _pxEx, _pxG} from './../../constants/PIXIabbr';
import {styles} from './../../constants/styles';
import {blockTexts} from './infoPanelData';


export default class limitsPanel {
	constructor() {
		let texts = blockTexts.limitBlock;

		// Контейнер для фишки с тенью и текстом
		this._spriteContainer = new _pxC();

		this.drawLine();

		texts.forEach((item) => {
			let newText = item.type === 'gradientText' ?
				new _pxEx.BitmapText(item.text, styles.infoPanel[item.type]) :
				new _pxT(item.text, styles.infoPanel[item.type]);

			newText.position = {x: item.x || 0, y: item.y || 0};

			this._spriteContainer.addChild(newText);
		});
	}

	get sprite(){
		return this._spriteContainer;
	}

	drawLine(){
		let line = new _pxG();
		line.lineStyle(1, 0xEEEE3A, 0.75).moveTo(20, 130).lineTo(320, 130);

		this._spriteContainer.addChild(line);
	}
}
