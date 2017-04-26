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

let _cb, _ctx;

export default class BetView {
	constructor(config) {
		this.cfg = config;
		this.limits = this.cfg.limits;
		_cb = this.cfg.callback, _ctx = this.cfg.ctx;

		presets.gameSounds.play('sound01');

		this._summ = 0;

		let chipType = 'chipSm0';
		for(let smChipKey in smallChipTypes)
			if(smallChipTypes[smChipKey] === config.value) chipType = smChipKey;

		this._betContainer = new _pxC();
		this._betContainer.x = config.pos.x;
		this._betContainer.y = config.pos.y;

		this._betContainer.interactive = true;

		presets.events.start.forEach((event)=>{
			this._betContainer.on(event, this.onTouchStart, this);
		});

		presets.events.end.forEach((event)=>{
			this._betContainer.on(event, this.onTouchEnd, this);
		});

		this.updateBet(config.value);
	}

	get betViewContainer(){
		return this._betContainer;
	}

	get balance(){
		return this._summ;
	}

	onTouchStart(){
		_cb.call(_ctx, 'touchStart', this); // метод betCallback в BetController
	}

	onTouchEnd(){
		presets.gameSounds.play('sound02');
		_cb.call(_ctx, 'touchEnd', this); // метод betCallback в BetController
	}

	/**
	 * Функция апдейта спрайта ставки
	 * Текст значения добавляется на последнюю фишку в контейнере
	 * @param value - значение, на которое нало увеличить ставку
	 */
	updateBet(value){
		let _temp = this._summ;

		(this._summ + value > this.limits.max) ? this._summ = this.limits.max : this._summ += value;

		if(this._summ && this._summ > _temp) presets.gameSounds.play('sound02');

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

		_cb.call(_ctx, 'change', this);
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
