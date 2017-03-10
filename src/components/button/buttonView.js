import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';

export default class ButtonView extends PIXI.Sprite {
	constructor(btnType, config) {
		super();

		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();

		spriteContainer.x = defaultPositions.buttons[btnType].x;
		spriteContainer.y = defaultPositions.buttons[btnType].y;

		if(btnType === 'btnCancel' || btnType === 'btnClear') btnType = 'btnAction';

		let sprite = new PIXI.Sprite( spritesStore.buttons[btnType] );

		// Opt-in to interactivity
		sprite.interactive = true;

		// Shows hand cursor
		sprite.buttonMode = true;

		sprite.anchor.set(0.5);

		sprite.on('tap', this.onClick, this);
		sprite.on('click', this.onClick, this);

		spriteContainer.addChild(sprite);

		return spriteContainer;
	}

	onClick(){
		if(this.onClickCb) {
			this.onClickCb.call(this.cbCtx, 'lol');
		} else {
			console.log('this default click on button sprite');
		}
	}
}
