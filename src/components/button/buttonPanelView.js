import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore, gameSounds} from './../../constants/presets';
import settings from './settings';

export default class ButtonView {
	constructor(config) {
		this._cfg = config;

		// Контейнер для фишки с тенью и текстом
		this._spriteContainer = new _pxC();

		this._buttons = {};

		for(let key in config){
			if(key === 'ctx') return;

			this._buttons[key] = new _pxC();
			let _b = this._buttons[key];

			_b.x = settings.position[key].x;
			_b.y = settings.position[key].y;

			// Opt-in to interactivity
			_b.interactive = true;
			// Shows hand cursor
			_b.buttonMode = true;

			let btn;
			if(key === 'btnCancel' || key === 'btnClear'){
				btn = this.squareBtnCreate(key);
				_b._btnViewType = 'square';
			} else {
				btn = this.roundBtnCreate(key);
				_b._btnViewType = 'round';
			}

			_b._btnType = key;
			_b._childSprites = {};
			for(let key in btn){
				_b._childSprites[key] = btn[key];
				_b.addChild(btn[key]);
			}

			['tap', 'click', 'pointertap'].forEach((event)=>{
				_b.on(event, this.onClick, this);
			});

			['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
				_b.on(event, this.btnSelect, this);
			});

			this._spriteContainer.addChild(_b);
		}
	}

	get getPixiSprite(){
		return this._spriteContainer;
	}

	/**
	 * ======================================== touch events =====================================
	 */
	onClick(event){
		let btn = event.target,
			btnType = btn._btnType;

		gameSounds.play('sound02');
		this.btnDefault(btn);

		this._cfg[btnType].call(this._cfg.ctx);
	}


	/**
	 * ======================================== view states =======================================
	 */
	btnDefault(btn){
		let type = btn._btnViewType, _ch = btn._childSprites;

		btn.interactive = true;
		btn.buttonMode = true;

		if(type === 'square'){
			_ch.icoDef.visible = true;
			_ch.icoDis.visible = false;
			_ch.text.alpha = 1;
		} else if(type === 'round') {
			_ch.stateDis.visible = false;
		}

		_ch.stateDef.visible = true;
		_ch.stateSel.visible = false;
	}

	btnAllDefault(){
		for(let key in this._buttons){
			let btn = this._buttons[key],
				btnType = btn._btnViewType;

			btn.interactive = true;
			btn.buttonMode = true;

			if(btnType === 'square'){
				btn._childSprites.icoDef.visible = true;
				btn._childSprites.icoDis.visible = false;
				btn._childSprites.text.alpha = 1;
			} else if(btnType === 'round') {
				btn._childSprites.stateDis.visible = false;
			}

			btn._childSprites.stateDef.visible = true;
			btn._childSprites.stateSel.visible = false;
		}
	}

	btnSelect(event){
		let btn = event.target, type = btn._btnViewType, _ch = btn._childSprites;

		_ch.stateDef.visible = false;
		_ch.stateSel.visible = true;

		if(type === 'square'){
			_ch.stateDef.visible = false;
			_ch.stateSel.visible = true;
		} else if(type === 'round') {
			_ch.stateDef.visible = false;
			_ch.stateSel.visible = true;
		}
	}

	btnDisable(){
		for(let key in this._buttons){
			let btn = this._buttons[key],
				btnType = btn._btnViewType;

			btn.interactive = false;
			btn.buttonMode = false;

			if(btnType === 'square'){
				btn._childSprites.icoDef.visible = false;
				btn._childSprites.icoDis.visible = true;
				btn._childSprites.text.alpha = 0.5;
			} else if(btnType === 'round') {
				btn._childSprites.stateDef.visible = false;
				btn._childSprites.stateSel.visible = false;
				btn._childSprites.stateDis.visible = true;
			}
		}
	}

	lockClear(lockStatus){
		let btn = this._buttons.btnClear;

		btn.interactive = !lockStatus;
		btn.buttonMode = !lockStatus;
		btn._childSprites.icoDef.visible = !lockStatus;
		btn._childSprites.icoDis.visible = lockStatus;
		btn._childSprites.text.alpha = lockStatus ? 0.5 : 1;
	}


	/**
	 * Создание квадратных кнопок
	 * @param btnSquareType
	 */
	squareBtnCreate(btnSquareType){
		let type = (btnSquareType === 'btnCancel') ? 'cn' : 'cl';

		let stateDef = new _pxS( spriteStore.buttons['btnAction'] ),
			stateSel = new _pxS( spriteStore.buttons['btnActionSel'] ),
			icoDef = new _pxS( spriteStore.buttons[type === 'cn' ? 'icoCancel' : 'icoClear'] ),
			icoDis = new _pxS( spriteStore.buttons[type === 'cn' ? 'icoCancelDis' : 'icoClearDis'] ),
			text = new _pxT( type === 'cn' ? settings.texts.cancel : settings.texts.clear, settings.textStyle );

		stateSel.visible = false;
		icoDis.visible = false;

		[stateDef, stateSel, icoDef, icoDis, text].forEach((item)=>{
			// this._spriteContainer.addChild(item);
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

		let stateDef = new _pxS( spriteStore.buttons[type === 'rpt' ? 'btnRepeat' : 'btnX2'] ),
			stateSel = new _pxS( spriteStore.buttons[type === 'rpt' ? 'btnRepeatSel' : 'btnX2Sel'] ),
			stateDis = new _pxS( spriteStore.buttons[type === 'rpt' ? 'btnRepeatDis' : 'btnX2Dis'] );

		stateSel.visible = false;
		stateDis.visible = false;

		[stateDef, stateSel, stateDis].forEach((item)=>{
			// this._spriteContainer.addChild(item);
			item.anchor.set(0.5);
		});

		return {stateDef, stateSel, stateDis}
	}
}
