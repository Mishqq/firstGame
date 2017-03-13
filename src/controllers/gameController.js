import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {transferFactory} from './../servises/transferFactory'
import {defaultPositions} from './../constants/defaultPositions';
import {spritesStore} from './../spritesStore';

// Components
import Background           from './../components/background/background';
import GameFieldController  from './../components/gameField/gameFieldController';
import ButtonController     from './../components/button/buttonController';
import ChipController       from './../components/chip/chipController';
import FloatChipController  from './../components/floatChip/floatChipController';
import BetController        from './../components/bet/betController';


export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
		console.log('init GameController');
		let game = this.game,
			stage = game.stage;

		this.stage = stage;

		/**
		 * background
		 */
		let bg = new Background();
		stage.addChild(bg);

		stage.interactive = true;

		stage.on('mousemove', this.onTouchMove, this);
		stage.on('touchmove', this.onTouchMove, this);

		stage.on('mouseup', this.onTouchEnd, this);
		stage.on('touchend', this.onTouchEnd, this);

		/**
		 * Игровое поле
		 */
		this.gameField = new GameFieldController();
		stage.addChild(this.gameField.gameFieldSprite);

		/**
		 * Прогружаем все json-атласы
		 */
		assetLoader(()=>{
			let chipsController = new ChipController();
			chipsController.chips.forEach((chip)=>{
				stage.addChild(chip);
			});

			let buttonsController = new ButtonController();
			buttonsController.buttons.forEach((button)=>{
				stage.addChild(button);
			});

			this.floatChipContainer = new FloatChipController();
			stage.addChild(this.floatChipContainer.getFloatChipsSprite);

			game.start();
		});
	};



	onTouchMove(event){
		if(transferFactory.chipActive){
			this.floatChipContainer.viewFloatChip(transferFactory.chipValue);
			this.floatChipContainer.setPosition( event.data.global );
		}
	}

	onTouchEnd(event){
		let gameFieldPos = this.gameField.gameFieldSprite.getBounds(),
			pos = event.data.global;

		// Если отпустили ставку над столом - то проводим её
		if(this.isPosInBounds(pos, gameFieldPos) && transferFactory.chipValue)
			this.setBet();

		this.clearTableBet();
	}

	/**
	 * Проверка принадлежности по координатам
	 * @param pos - {x, y}
	 * @param bounds - {x, y, width, height}
	 */
	isPosInBounds(pos, bounds){
		return pos.x >= bounds.x && pos.x <= (bounds.x + bounds.width) &&
		pos.y >= bounds.y && pos.y <= (bounds.y + bounds.height);
	}

	setBet(){
		let gameFieldPos = defaultPositions.fields.big,
			testPos = {x: 150+gameFieldPos.x, y: 200+gameFieldPos.y};

		let betController = new BetController(testPos);
		this.stage.addChild(betController.betSprite);

		console.log('Делаем ставку ➠ ', transferFactory.chipValue);
	};

	clearTableBet(){
		transferFactory.chipActive = false;
		transferFactory.chipValue = undefined;
		this.floatChipContainer.hideFloatChip();
		this.gameField.hideCircles();
	};
}