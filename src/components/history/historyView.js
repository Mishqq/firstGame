import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {colorNumMap} from './historyData';
import {styles} from './../../constants/styles';
import {_hf} from './../../servises/helpFunctions';
import {TweenMax, Power2, TimelineLite} from "gsap";

export default class historyView {
	constructor(config) {
		this.cbCtx = (config.ctx) ? config.ctx : this;
		this.rollCb = (config.rollCb) ? config.rollCb : ()=>{console.log('lolec ➠ ')};
		this.rollTime = (config.rollTime) ? config.rollTime : 2.5;
		this.viewResultTime = (config.viewResultTime) ? config.viewResultTime : 1.5;

		this.hTape = [];
		this.hTapeSprites = [];

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.position = defaultPositions.history;

		this.createRollField();
		this.rollPlay();

		spriteContainer.addChild( this.rollAnm );
	}

	get getPixiSprite(){
		return this._spriteContainer;
	}

	/**
	 * Поле с анимацией
	 */
	createRollField(){
		let arrForAnimation = [];
		for(let key in spritesStore.anums)
			arrForAnimation.push( spritesStore.anums[key] );
		this.rollAnm = new _pxEx.MovieClip(arrForAnimation);
		this.rollAnm.animationSpeed = 0.25;
	}
	rollPlay(){
		this.rollAnm.play();

		setTimeout(() => {
			this.viewRollResult();
			this.rollStop();
		}, this.rollTime * 1000)
	}
	rollStop(){
		this.rollAnm.gotoAndStop(0);
	}

	viewRollResult(){

	}

	addNum(num){
		this.hTape.push(num);

		let color;
		for(let key in colorNumMap)
			if(~colorNumMap[key].indexOf(num)) color = key;

		if(num === 'zero' || num === 0) num = '0';
		if(num === 'doubleZero') num = '00';

		let newNum = new _pxS(spritesStore.bgNumbers[color]);
		this.hTapeSprites.unshift(newNum);
		this._spriteContainer.addChildAt( newNum, 0 );
		newNum.addChild( this.addNumText(num) );

		// Сдвигаем все вниз
		this.hTapeSprites.forEach((item, idx) => {
			let newY = 170 + 65*idx;
			let tween = new TweenLite(item, 1, {y: newY});
		});
	}

	addNumText(num){
		let numText = new _pxT(num, styles.infoPanel.number);
		numText.anchor.set(0.5, 0.5);
		numText.position = {x: 32, y: 32};

		return numText;
	}
}
