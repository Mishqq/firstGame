import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import presets from './../../constants/presets';
import {gameSounds} from '../../services/resourseLoader';

export default class betButtonView {
	constructor(config) {
		this.onClickCb = (config.onClickCb) ? config.onClickCb : undefined;
		this.cbCtx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.interactive = true;
		spriteContainer.buttonMode = true;

		// spriteContainer.x = presets.positions.buttons[btnType].x;
		// spriteContainer.y = presets.positions.buttons[btnType].y;


		['tap', 'click', 'pointertap'].forEach((event)=>{
			spriteContainer.on(event, this.onClick, this);
		});
	}

	get getPixiSprite(){
		return  this._spriteContainer;
	}


	disable(){

	};


	enable(){

	};


	click(){

	}
}
