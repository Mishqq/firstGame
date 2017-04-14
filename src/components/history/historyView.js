import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {_hf} from '../../services/helpFunctions';
import {TweenMax, Power2, TimelineLite} from "gsap";

let colorBigNumMap = {
	bgBigRed: presets.data.colorNumMap.bgRed,
	bgBigBlack: presets.data.colorNumMap.bgBlack,
	bgBigZero: presets.data.colorNumMap.bgZero
};

export default class historyView {
	constructor(config, callbacks) {
		this.cb = callbacks;

		this.rolledNum = undefined;

		this._hisSprites = {
			rollNumAnimation: undefined,
			rollNumSprite: undefined,
			numTape: []
		};

		this.rollTime = (config.rollTime) ? config.rollTime : 2.5;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.position = presets.positions.history;

		this.createRollField();
		this.rollPlay();

		spriteContainer.addChild( this._hisSprites.rollNumAnimation );
	}

	get getPixiSprite(){
		return this._spriteContainer;
	}

	/**
	 * Поле с анимацией
	 */
	createRollField(){
		let _a = this._hisSprites,
			arrForAnimation = [];
		for(let key in presets.spriteStore.anums)
			arrForAnimation.push( presets.spriteStore.anums[key] );

		_a.rollNumAnimation = new _pxEx.MovieClip(arrForAnimation);
		_a.rollNumAnimation.animationSpeed = 0.25;
	}

	/**
	 * Состояние рола числа.
	 * Если это не первый рол - добалвяем в ленту число предыдущего рола
	 */
	rollPlay(){
		let _a = this._hisSprites;

		if(this.rolledNum){
			this.addNum(this.rolledNum);
			this.rolledNum = undefined;
			_a.rollNumAnimation.visible = true;
			this._spriteContainer.removeChild(_a.rollNumSprite);
		}

		// _a.rollNumAnimation.play();
		_a.rollNumAnimation.gotoAndPlay(0);

		setTimeout(() => {
			// this.viewRollResult( 12 );
			this.viewRollResult( _hf.randEl(presets.data.history.rollNumbers) );
			_a.rollNumAnimation.gotoAndStop(0);

			this.cb.rollCb.call(this.cb.ctx, this.rolledNum);
		}, this.rollTime * 1000)
	}

	/**
	 * Показываем нароленное число
	 * @param num
	 */
	viewRollResult(num){
		let _a = this._hisSprites;
		_a.rollNumSprite = new _pxS(presets.spriteStore.bgNumbers[ _hf.colorType(colorBigNumMap, num) ]);

		let text = (num === 37) ? '00' : num;
		_hf.addTextToSprite(_a.rollNumSprite, {x: 84, y: 84}, text, presets.textStyles.historyPanel.big);

		_a.rollNumAnimation.visible = false;

		this._spriteContainer.addChild(_a.rollNumSprite);

		this.rolledNum = num;
	}


	addNum(num){
		let _hs = this._hisSprites;

		let newNum = new _pxS(presets.spriteStore.bgNumbers[ _hf.colorType(presets.data.colorNumMap, num) ]);
		_hs.numTape.unshift(newNum);
		this._spriteContainer.addChildAt( newNum, 0 );

		let text = (num === 37) ? '00' : num;
		_hf.addTextToSprite(newNum, {x: 32, y: 32}, text, presets.textStyles.historyPanel.small);

		// Сдвигаем все вниз
		_hs.numTape.forEach((item, idx) => {
			let newY = 170 + 65*idx;
			let tween = new TweenLite(item, 1, {y: newY});
		});
	}
}
