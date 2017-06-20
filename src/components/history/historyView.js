import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settings from './settings';
import {_hf} from '../../services/helpFunctions';
import {TweenMax, Power2, TimelineLite} from "gsap";

let colorBigNumMap = {
	bgBigRed: settings.numColor.bgRed,
	bgBigBlack: settings.numColor.bgBlack,
	bgBigZero: settings.numColor.bgZero
};

export default class historyView {
	constructor() {
		this.rolledNum = undefined;

		this._hisSprites = {
			rollNumAnimation: undefined,
			rollNumSprite: undefined,
			numTape: []
		};

		this.rollTime = 0;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.position = settings.position;

		this.createRollField();
		//this.rollPlay();

		spriteContainer.addChild( this._hisSprites.rollNumAnimation );
	}

	get getPixiSprite(){
		return this._spriteContainer;
	}

	setData(bets){
		bets.forEach((item) => {
			this.addNum(item, false);
		});
	}

	setRollTime(time){
		this.rollTime = time;
	}

	/**
	 * Поле с анимацией
	 */
	createRollField(){
		let _a = this._hisSprites,
			arrForAnimation = [];
		for(let key in spriteStore.anums)
			arrForAnimation.push( spriteStore.anums[key] );

		_a.rollNumAnimation = new _pxEx.MovieClip(arrForAnimation);
		_a.rollNumAnimation.animationSpeed = 0.25;
	}

	/**
	 * Состояние рола числа.
	 * Если это не первый рол - добалвяем в ленту число предыдущего рола
	 */
	rollPlay(){
		let _a = this._hisSprites;

		if(!isNaN(this.rolledNum)){
			this.rolledNum = undefined;
			_a.rollNumAnimation.visible = true;
			this._spriteContainer.removeChild(_a.rollNumSprite);
		}

		_a.rollNumAnimation.gotoAndPlay(0);
	}

	/**
	 * Показываем нароленное число
	 * @param num
	 */
	viewRollResult(num){
		let _a = this._hisSprites;
		_a.rollNumSprite = new _pxS(spriteStore.bgNumbers[ _hf.colorType(colorBigNumMap, num) ]);

		let text = (num === 37) ? '00' : num;
		_hf.addTextToSprite(_a.rollNumSprite, {x: 84, y: 84}, text, settings.textStyle.big);

		_a.rollNumAnimation.visible = false;

		this._spriteContainer.addChild(_a.rollNumSprite);

		this._hisSprites.numTape.forEach((item, idx) => {
			item.y = 170 + 65*idx;
		});

		this.rolledNum = num;
	}

	hideRollResult(){
		if(this._hisSprites.rollNumSprite)
			this._spriteContainer.removeChild(this._hisSprites.rollNumSprite);
	}


	addNum(num, animate){
		let _hs = this._hisSprites;

		let newNum = new _pxS(spriteStore.bgNumbers[ _hf.colorType(settings.numColor, num) ]);
		_hs.numTape.unshift(newNum);
		this._spriteContainer.addChildAt( newNum, 0 );

		let text = (num === 37) ? '00' : num;
		_hf.addTextToSprite(newNum, {x: 32, y: 32}, text, settings.textStyle.small);

		// Сдвигаем все вниз
		_hs.numTape.forEach((item, idx) => {
			let newY = 170 + 65*idx;
			// let tween = new TweenLite(item, 1, {y: newY});
			animate ? new TweenLite(item, 1, {y: newY}) : item.y = newY;
		});
	}

	showRollAnim(status){
		this._hisSprites.rollNumAnimation.visible = status;

		if(status) this.hideRollResult();

		let dY = status ? 170 : 0;
		this._hisSprites.numTape.forEach((item, idx) => {
			item.y = dY + 65*idx;
		});
	}
}
