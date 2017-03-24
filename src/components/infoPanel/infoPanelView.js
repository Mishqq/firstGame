import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';
import {_hf} from './../../servises/helpFunctions'

// views
import limitsView from './limitsView'

export default class infoPanelView {
	constructor(config) {
		// this.callback = (config.callback) ? config.callback : undefined;
		// this.ctx = (config.ctx) ? config.ctx : this;

		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new PIXI.Container();
		this._spriteContainer = spriteContainer;

		spriteContainer.x = defaultPositions.infoPanel.main.x;
		spriteContainer.y = defaultPositions.infoPanel.main.y;

		let bg = new PIXI.Sprite.fromImage('./assets/images/bg_info.png');
		spriteContainer.addChild(bg);
		for(let i=1; i<=3; i+=1){
			let sep = new PIXI.Sprite.fromImage('./assets/images/separator_vert.png');
			sep.x = i*337;
			sep.y = 0;
			spriteContainer.addChild( sep );
		}

		this.panels = {};
		this.panels.limitsPanel = new limitsView();

		spriteContainer.addChild( this.panels.limitsPanel.sprite );
	}

	get sprite(){
		return this._spriteContainer;
	}

	set active(active){
		this._active = active
	}

	chipTouchEnd(){
		this.callback ?
			this.callback.call(this.ctx) :
			console.log('infoPanelView');
	}
}
