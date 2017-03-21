import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';

export default class ButtonView {
	constructor(btnType, config) {
		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this._spriteContainer = spriteContainer;

		spriteContainer.interactive = true;
		spriteContainer.buttonMode = true;

		spriteContainer.x = defaultPositions.buttons[btnType].x;
		spriteContainer.y = defaultPositions.buttons[btnType].y;

		if(btnType === 'btnCancel' || btnType === 'btnClear'){
			this._sqrBtn = this.squareBtnCreate(btnType);
		} else {
			this._rndBtn = this.roundBtnCreate(btnType);
		}

		['tap', 'click', 'pointertap'].forEach((event)=>{
			spriteContainer.on(event, this.onClick, this);
		});

		['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
			spriteContainer.on(event, this.onTouchStart, this);
		});
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}

	onClick(){
		this.btnDefault();

		if(this.onClickCb) {
			this.onClickCb.call(this.cbCtx, 'lol');
		} else {
			console.log('this default click on button sprite');
		}
	}

	onTouchStart(){
		this.btnSelect();
	}

	btnDefault(){
		if(this._sqrBtn){
			this._sqrBtn.stateDef.visible = true;
			this._sqrBtn.icoDef.visible = true;
			this._sqrBtn.stateSel.visible = false;
			this._sqrBtn.icoDis.visible = false;
			this._sqrBtn.text.alpha = 1;
		} else {
			this._rndBtn.stateDef.visible = true;
			this._rndBtn.stateSel.visible = false;
			this._rndBtn.stateDis.visible = false;
		}
	}

	btnSelect(){
		if(this._sqrBtn){
			this._sqrBtn.stateDef.visible = false;
			this._sqrBtn.stateSel.visible = true;
		} else {
			this._rndBtn.stateDef.visible = false;
			this._rndBtn.stateSel.visible = true;
		}
	}

	btnDisable(){
		if(this._sqrBtn){
			this._sqrBtn.icoDef.visible = false;
			this._sqrBtn.icoDis.visible = true;
			this._sqrBtn.text.alpha = 0.5;
		} else {
			this._rndBtn.stateDef.visible = false;
			this._rndBtn.stateSel.visible = false;
			this._rndBtn.stateDis.visible = true;
		}
	}


	/**
	 * Создание квадратных кнопок
	 * @param btnSquareType
	 */
	squareBtnCreate(btnSquareType){
		let type = (btnSquareType === 'btnCancel') ? 'cn' : 'cl';

		let stateDef = new PIXI.Sprite( spritesStore.buttons['btnAction'] ),
			stateSel = new PIXI.Sprite( spritesStore.buttons['btnActionSel'] ),
			icoDef = new PIXI.Sprite( spritesStore.buttons[type === 'cn' ? 'icoCancel' : 'icoClear'] ),
			icoDis = new PIXI.Sprite( spritesStore.buttons[type === 'cn' ? 'icoCancelDis' : 'icoClearDis'] ),
			text = new PIXI.Text( type === 'cn' ? 'Отменить' : 'Очистить', styles.buttonStyle );

		stateSel.visible = false;
		icoDis.visible = false;

		[stateDef, stateSel, icoDef, icoDis, text].forEach((item)=>{
			this._spriteContainer.addChild(item);
			item.anchor.set(0.5);
		});

		text.anchor.set(0.35, 0.5);
		icoDef.x = -65;
		icoDis.x = -65;

		return {stateDef, stateSel, icoDef, icoDis, text}
	}

	/**
	 * Создание круглых кнопок
	 * @param btnSquareType
	 */
	roundBtnCreate(btnSquareType){
		let type = (btnSquareType === 'btnRepeat') ? 'rpt' : 'x2';

		let stateDef = new PIXI.Sprite( spritesStore.buttons[type === 'rpt' ? 'btnRepeat' : 'btnX2'] ),
			stateSel = new PIXI.Sprite( spritesStore.buttons[type === 'rpt' ? 'btnRepeatSel' : 'btnX2Sel'] ),
			stateDis = new PIXI.Sprite( spritesStore.buttons[type === 'rpt' ? 'btnRepeatDis' : 'btnX2Dis'] );

		stateSel.visible = false;
		stateDis.visible = false;

		[stateDef, stateSel, stateDis].forEach((item)=>{
			this._spriteContainer.addChild(item);
			item.anchor.set(0.5);
		});

		return {stateDef, stateSel, stateDis}
	}
}
