import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {transferFactory} from './../servises/transferFactory'
import {spritesStore} from './../spritesStore';

// Components
import Background           from './../components/background/background';
import GameFieldController  from '../components/gameField/gameFieldController';
import ButtonController     from './../components/button/buttonController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';



export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
		console.log('init GameController');

		/**
		 * background
		 */
		let bg = new Background();
		this.game.stage.addChild(bg);

		this.game.stage.interactive = true;

		this.game.stage.on('mousemove', this.onTouchMove, this);
		this.game.stage.on('touchmove', this.onTouchMove, this);

		this.game.stage.on('mouseup', this.onTouchEnd, this);
		this.game.stage.on('touchend', this.onTouchEnd, this);

		/**
		 * Прогружаем все json-атласы
		 */
		assetLoader(()=>{
			let gameField = new GameFieldController();
			this.game.stage.addChild(gameField.gameFieldSprite);

			let chipsController = new ChipController();
			chipsController.chips.forEach((chip)=>{
				this.game.stage.addChild(chip);
			});

			let buttonsController = new ButtonController();
			buttonsController.buttons.forEach((button)=>{
				this.game.stage.addChild(button);
			});

			this.floatChipContainer = new FloatChipController();
			this.game.stage.addChild(this.floatChipContainer.getFloatChipsSprite);

			this.game.start();
		});
	};



	onTouchMove(event){
		if(transferFactory.chipActive){
			this.floatChipContainer.viewFloatChip(transferFactory.chipValue);
			this.floatChipContainer.setPosition( event.data.global );
		}
	}

	onTouchEnd(){

	}
}