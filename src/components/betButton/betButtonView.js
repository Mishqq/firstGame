import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';

export default class betButtonView {
	constructor(config) {
		this._cfg = config;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.interactive = true;
		spriteContainer.buttonMode = true;

		this.btnStates = {default: '', hover: '', disable: '',};

		spriteContainer.position = presets.positions.betButton;

		this.btnStates.default = new _pxS( presets.spriteStore.bet.bet1 );
		this.btnStates.disable = new _pxS( presets.spriteStore.bet.bet2 );
		this.btnStates.hover = new _pxS( presets.spriteStore.bet.bet3 );

		this.btnStates.disable.x = -3;
		this.btnStates.hover.x = -6;

		this.btnStates.hover.visible = false;
		this.btnStates.disable.visible = false;

		['touchstart', 'mousedown', 'pointerdown'].forEach((event)=>{
			this._spriteContainer.on(event, ()=>{
				this.btnStates.default.visible = false;
				this.btnStates.hover.visible = true;
			});
		});

		['touchend', 'mouseup', 'pointerup'].forEach((event)=>{
			this._spriteContainer.on(event, this.click, this);
		});

		for(let key in this.btnStates){
			spriteContainer.addChild( this.btnStates[key] );
		}
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}


	disable(){
		this.btnStates.default.visible = false;
		this.btnStates.hover.visible = false;
		this.btnStates.disable.visible = true;

		this._spriteContainer.interactive = false;
		this._spriteContainer.buttonMode = false;
	};


	enable(){
		this.btnStates.default.visible = true;
		this.btnStates.hover.visible = false;
		this.btnStates.disable.visible = false;

		this._spriteContainer.interactive = true;
		this._spriteContainer.buttonMode = true;
	};


	click(){
		this.btnStates.default.visible = true;
		this.btnStates.hover.visible = false;

		this._cfg.click.call( this._cfg.ctx )
	}
}
