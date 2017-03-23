import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {styles} from './../../constants/styles';
import {smallChipTypes} from './../../constants/chipValues';
import {_hf} from './../../servises/helpFunctions'
import {_tevStore, _tev} from './../../servises/touchEvents'

export default class BetView {
	constructor(config, value) {
		this._summ = (value) ? value : 0;

		let chipType = 'chipSm0';
		for(let smChipKey in smallChipTypes)
			if(smallChipTypes[smChipKey] === value) chipType = smChipKey;

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.onTouchEndCb = (config.onTouchEndCb) ? config.onTouchEndCb : undefined;
		this.onTouchStartCb = (config.onTouchStartCb) ? config.onTouchStartCb : undefined;
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

		['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
			this._betContainer.on(event, this.onTouchStart, this);
		});

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

	/**
	 * Функция вызывается при окончании движения ставки на уже существующем спрайте.
	 * Тут есть небольшой косяк: вьюха будет знать о модели, т.к. данную функцию
	 * нельзя вызвать ниоткуда, кроме как событиями 'touchend','mouseup','pointerup' (PIXI-events)
	 * @param event
	 */
	onTouchEnd(event){
		this.onTouchEndCb ?
			this.onTouchEndCb.call(this.cbCtx, event) :
			console.log('betTouchEnd (BetView)');
	}

	get balance(){
		return this._summ;
	}

	onTouchStart(){
		_tev.setEvent(_tevStore.BET_TOUCH_START);

		this.onTouchStartCb ?
			this.onTouchStartCb.call(this.cbCtx, this.getTopChipValue()) :
			console.log('betTouchStart (BetView)');
	}

	/**
	 * Функция апдейта спрайта ставки
	 * Текст значения добавляется на последнюю фишку в контейнере
	 * @param value - значение, на которое нало увеличить ставку
	 */
	updateBet(value){
		this._summ += value;

		let spriteContainer = this.betViewContainer;

		let betSprites = this.calculateSprites(this._summ);

		let sortChipSmTypeArr = [];
		for(let key in betSprites)
			sortChipSmTypeArr.push(key);
		sortChipSmTypeArr.reverse();

		spriteContainer.removeChildren();

		let count=0;
		sortChipSmTypeArr.forEach((chipSmType, idx)=>{
			for(let i=0; i<betSprites[chipSmType]; i+=1){
				let newSprite = new PIXI.Sprite( spritesStore.chips[chipSmType] );
				newSprite.anchor.set(0.5);
				newSprite.y -= count*5;
				spriteContainer.addChild(newSprite);
				count++;
			}
		});

		if(spriteContainer.children.length){
			let chipValueText = new PIXI.Text( _hf.formatChipValue(this._summ), styles.chipSmTextStyle );
			chipValueText.anchor.set(0.5, 0.6);

			spriteContainer.children[ spriteContainer.children.length-1 ].addChild(chipValueText);
		}

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

		let q = {}; // объект вида {100: 1, 500:2} - одна фишка значения 100, две по 500
		ranges.forEach((range)=>{
			let num = Math.floor(value/range);
			if(num > 0){
				q[range] = num;
				value -= q[range]*range;
			}
		});

		let q2 = {}; // объект вида {chipSm0: 1, chipSm1:2} - одна фишка типа chipSm0, две chipSm1
		for(let chipType in smallChipTypes){
			for(let chipValue in q){
				if(smallChipTypes[chipType] === +chipValue) q2[chipType] = q[chipValue];
			}
		}

		return q2;
	}

	getTopChipValue(){
		let betSprites = this.calculateSprites(this._summ);

		let sortChipSmTypeArr = [];
		for(let key in betSprites)
			sortChipSmTypeArr.push(key);

		let value = smallChipTypes[ sortChipSmTypeArr[0] ];

		return value;
	}

	disableMove(){
		this.betViewContainer.interactive = false;
	}

	enableMove(){
		this.betViewContainer.interactive = true;
	}
}
