import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {defaultPositions} from './../../constants/defaultPositions';
import {styles} from './../../constants/styles';

// views
import limitsView from './limitsView'
import hotNumView from './hotNumbersView'
import coldNumView from './coldNumbersView'
import otherNumView from './otherNumbersView'

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
		this.panels.hotNumPanel = new hotNumView();
		this.panels.coldNumbers = new coldNumView();
		this.panels.otherNumView = new otherNumView();

		this.panels.limitsPanel.sprite.position = defaultPositions.infoPanel.limits;
		this.panels.hotNumPanel.sprite.position = defaultPositions.infoPanel.hotNumbers;
		this.panels.coldNumbers.sprite.position = defaultPositions.infoPanel.coldNumbers;
		this.panels.otherNumView.sprite.position = defaultPositions.infoPanel.otherNumbers;

		for(let key in this.panels)
			spriteContainer.addChild( this.panels[key].sprite );
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
