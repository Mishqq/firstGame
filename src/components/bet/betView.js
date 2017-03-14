import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {styles} from './../../constants/styles';

export default class BetView extends PIXI.Sprite {
	constructor(config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		this._betContainer = new PIXI.Container();
		this._betContainer.x = config.pos.x;
		this._betContainer.y = config.pos.y;

		let betSprite = new PIXI.Sprite( spritesStore.chips['chipSm0'] );
		betSprite.anchor.set(0.5);

		this._betContainer.addChild(betSprite);
	}

	get betViewContainer(){
		return this._betContainer;
	}

	onClick(){
		(this.onClickCb) ?
			this.onClickCb.call(this.cbCtx) :
			console.log('betClickEvent (betView)');
	}

	setText(text){
		// let chipValueText = new PIXI.Text( text, floatChipTextStyle );
	}

	updateBet(){

	}
}
