import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {styles} from './../../constants/styles';
import {smallChipTypes} from './../../constants/chipValues';
import {_hf} from './../../servises/helpFunctions'

export default class BetView extends PIXI.Sprite {
	constructor(config, value) {
		super();

		this._summ = (value) ? value : 0;

		let chipType = 'chipSm0';
		for(let smChipKey in smallChipTypes)
			if(smallChipTypes[smChipKey] === value) chipType = smChipKey;

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.updateBetModel = (config.updateBetModel) ? config.updateBetModel : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		this._betContainer = new PIXI.Container();
		this._betContainer.x = config.pos.x;
		this._betContainer.y = config.pos.y;

		this._betContainer.interactive = true;

		let betSprite = new PIXI.Sprite( spritesStore.chips[chipType] );
		betSprite.anchor.set(0.5);

		let chipValueText = new PIXI.Text( _hf.formatChipValue(value), styles.chipSmTextStyle );
		chipValueText.anchor.set(0.5);

		['touchend', 'mouseup', 'pointerup'].forEach((event)=>{
			this._betContainer.on(event, this.onTouchEnd, this);
		});

		this._betContainer.addChild(betSprite);
		this._betContainer.addChild(chipValueText);
	}

	get betViewContainer(){
		return this._betContainer;
	}

	onClick(){
		this.onClickCb ?
			this.onClickCb.call(this.cbCtx) :
			console.log('betClickEvent (betView)');
	}

	onTouchEnd(event){
		event.stopPropagation();

		this.updateBet();
	}

	setText(text){
		// let chipValueText = new PIXI.Text( text, floatChipTextStyle );
	}

	updateBet(value){
		this._summ += value;

		let sprites = this.betViewContainer.children,
			textSprite = sprites[ sprites.length-1 ];

		textSprite.text = _hf.formatChipValue(this._summ);

		this.calculateSprites(this._summ);

		// let chipType = 'chipSm0';
		// for(let smChipKey in smallChipTypes)
		// 	if(smallChipTypes[smChipKey] === value) chipType = smChipKey;


		this.updateBetModel ?
			this.updateBetModel.call(this.cbCtx) :
			console.log('updateBetModel (betView)', this.updateBetModel);
	}

	/**
	 * Функция рассчитывает какое количество каких типов фишек нужно для данного значения
	 * @param value
	 */
	calculateSprites(value){
		let ranges = [];
		for(let key in smallChipTypes)
			ranges.push( smallChipTypes[key] );

		ranges.sort((a, b)=>{return a < b});

		let q = {};

		ranges.forEach((range)=>{
			let num = Math.floor(value/range);
			if(num > 0){
				q[range] = num;
				value -= q[range]*range;
			}
		});
	}
}
