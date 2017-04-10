import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {_hf} from '../../services/helpFunctions'
import {TweenMax, Power2, TimelineLite} from "gsap";

let smallChipTypes = {
	chipSm0: presets.data.chipValues.chip0,
	chipSm1: presets.data.chipValues.chip1,
	chipSm2: presets.data.chipValues.chip2,
	chipSm3: presets.data.chipValues.chip3,
	chipSm4: presets.data.chipValues.chip4
};


export default class BetView {
	constructor(config, value) {
		this.cfg = config;

		presets.gameSounds.play('sound01');

		this._summ = (value) ? value : 0;

		let chipType = 'chipSm0';
		for(let smChipKey in smallChipTypes)
			if(smallChipTypes[smChipKey] === value) chipType = smChipKey;

		this._betContainer = new _pxC();
		this._betContainer.x = config.pos.x;
		this._betContainer.y = config.pos.y;

		this._betContainer.interactive = true;

		let betSprite = new _pxS( presets.spriteStore.chips[chipType] );
		betSprite.anchor.set(0.5);

		let chipValueText = new _pxT( _hf.formatChipValue(value), presets.textStyles.chipSmTextStyle );
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

	/**
	 * Функция вызывается при окончании движения ставки на уже существующем спрайте.
	 * Тут есть небольшой косяк: вьюха будет знать о модели, т.к. данную функцию
	 * нельзя вызвать ниоткуда, кроме как событиями 'touchend','mouseup','pointerup' (PIXI-events)
	 * @param event
	 */
	onTouchEnd(event){
		// метод touchEnd в BetController
		this.cfg.touchEnd.call(this.cfg.ctx, event)
	}

	get balance(){
		return this._summ;
	}

	onTouchStart(event){
		presets.gameSounds.play('sound02');
		// метод touchStart в BetController
		this.cfg.touchStart.call(this.cfg.ctx, event, true);
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
				let newSprite = new _pxS( presets.spriteStore.chips[chipSmType] );
				newSprite.anchor.set(0.5);
				newSprite.y -= count*5;
				spriteContainer.addChild(newSprite);
				count++;
			}
		});

		if(spriteContainer.children.length){
			let chipValueText = new _pxT( _hf.formatChipValue(this._summ), presets.textStyles.chipSmTextStyle );
			chipValueText.anchor.set(0.5, 0.6);

			spriteContainer.children[ spriteContainer.children.length-1 ].addChild(chipValueText);
		}

		presets.gameSounds.play('sound01');

		this.cfg.updateBetModel.call(this.cfg.ctx);
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

	/**
	 * Возвращаем значение верхней снимаемой фишки со стопки
	 * @returns {*}
	 */
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


	clearBet(){
		let tween = new TweenLite(this._betContainer, 1, {x:0, y:0, alpha: 0});
	}
}
