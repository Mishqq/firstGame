import {_pxC, _pxT, _pxEx, _pxG} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {_hf} from '../../services/helpFunctions';


export default class limitsPanel {
	constructor(limits) {
		let texts = presets.texts.infoPanel.limitBlock;

		this.limits = limits || presets.data.infoPanel.limitsPanel;

		this.limSprts = {};
		let style = {font: "normal 24px Arial", fill: 'white'};
		for(let key in this.limits)
			this.limSprts[key] = new _pxT(_hf.formatLimit(this.limits[key]), style)

		this.limSprts.max.anchor.set(1, 0.5);
		this.limSprts.min.anchor.set(1, 0.5);

		this.limSprts.max.position = {x: 310, y: 105};
		this.limSprts.min.position = {x: 310, y: 155};

		// Контейнер для фишки с тенью и текстом
		this._spriteContainer = new _pxC();

		this.drawLine();

		texts.forEach((item) => {
			let newText = item.type === 'gradientText' ?
				new _pxEx.BitmapText(item.text, presets.textStyles.infoPanel[item.type]) :
				new _pxT(item.text, presets.textStyles.infoPanel[item.type]);

			newText.position = {x: item.x || 0, y: item.y || 0};

			this._spriteContainer.addChild(newText);
		});

		for(let key in this.limSprts)
			this._spriteContainer.addChild(this.limSprts[key]);
	}

	get sprite(){
		return this._spriteContainer;
	}

	drawLine(){
		let line = new _pxG();
		line.lineStyle(1, 0xEEEE3A, 0.75).moveTo(20, 130).lineTo(320, 130);

		this._spriteContainer.addChild(line);
	}

	updateView(newLimits){
		if(newLimits && newLimits.max) this.limSprts.max.text = _hf.formatLimit(newLimits.max);
		if(newLimits && newLimits.min) this.limSprts.min.text = _hf.formatLimit(newLimits.min);
	}
}
