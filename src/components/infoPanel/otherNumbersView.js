import {_p, _pxC, _pxS, _pxT, _pxEx, _pxG} from './../../constants/PIXIabbr';
import {spritesStore} from './../../spritesStore';
import presets from './../../constants/presets';

export default class otherNumPanel {
	constructor(numbers) {
		// Позиции цифр в последнем блоке
		this.numbersPos = {
			red:    {x: 70, y: 72},
			black:  {x: 250, y: 72},
			odd:    {x: 50, y: 155},
			even:   {x: 260, y: 155},
			zero:   {x: 150, y: 155}
		};

		this.numbers = numbers || {red: 0, black: 0, odd: 0, even: 0, zero: 0};

		this.numbersSprites = {};

		let texts = presets.texts.infoPanel.otherNumbers;

		// Контейнер для фишки с тенью и текстом
		this._spriteContainer = new _pxC();

		this.drawLine();
		this.drawRhombus();
		this.drawNumbers();

		texts.forEach((item) => {
			let newText = item.type === 'gradientText' ?
				new _pxEx.BitmapText(item.text, presets.textStyles.infoPanel[item.type]) :
				new _pxT(item.text, presets.textStyles.infoPanel[item.type]);

			newText.position = {x: item.x || 0, y: item.y || 0};

			this._spriteContainer.addChild(newText);
		});
	}

	get sprite(){
		return this._spriteContainer;
	}

	/**
	 * Отрисовка цифр. Спрайты и значения храним в объектах
	 */
	drawNumbers(){
		for(let key in this.numbers){
			let num = this.numbers[key] + '%';

			if(!this.numbersSprites[key]){
				this.numbersSprites[key] = new _pxT(num, presets.textStyles.infoPanel.whiteText);
				this.numbersSprites[key].position = this.numbersPos[key];
				this._spriteContainer.addChild(this.numbersSprites[key]);
			} else {
				this.numbersSprites[key].text = num;
			}
		}
	}

	/**
	 * Обновление данных
	 * @param obj
	 */
	updateView(obj){
		for(let key in obj)
			this.numbers[key] = obj[key] || 0;

		this.drawNumbers();
	}

	drawLine(){
		let line = new _pxG();
		line.lineStyle(1, 0xEEEE3A, 0.75).moveTo(20, 110).lineTo(320, 110);

		this._spriteContainer.addChild(line);
	}

	drawRhombus(){
		let redR = new _pxS(spritesStore.bgNumbers.icoRed);
		redR.position = {x: 20, y: 75};

		let blackR = new _pxS(spritesStore.bgNumbers.icoBlack);
		blackR.position = {x: 200, y: 75};
		this._spriteContainer.addChild(redR);
		this._spriteContainer.addChild(blackR);
	}
}
