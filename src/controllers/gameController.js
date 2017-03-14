import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import {assetLoader} from './../assetsLoader'
import {transferFactory} from './../servises/transferFactory'
import {defaultPositions} from './../constants/defaultPositions';
import {spritesStore} from './../spritesStore';

import {_hf} from './../servises/helpFunctions';

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
			for(let key in chipsController.chips){
				stage.addChild(chipsController.chips[key].sprite);
			}

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
		if(transferFactory.activeChip){
			this.floatChipContainer.viewFloatChip(transferFactory.activeChip.value);
			this.floatChipContainer.setPosition( event.data.global );
		}
	}

	onTouchEnd(event){
		let gameFieldPos = this.gameField.gameFieldSprite.getBounds(),
			pos = event.data.global;

		// Если отпустили ставку над столом - то проводим её
		if(_hf.isPosInBounds(pos, gameFieldPos) && transferFactory.activeChip)
			this.setBet({
				x: pos.x - gameFieldPos.x,
				y: pos.y - gameFieldPos.y
			});

		this.clearTableBet();
	}

	/**
	 * Функция ставки.
	 * @param pos - {x, y} - позиция события
	 */
	setBet(pos){
		let gameFieldPos = this.gameField.gameFieldSprite.getBounds();

		pos = this.getCoordsForBet(pos);

		if(pos){
			pos.x = pos.x + gameFieldPos.x;
			pos.y = pos.y + gameFieldPos.y;

			let betController = new BetController(pos);
			this.stage.addChild(betController.betSprite);

			console.log('Делаем ставку ➠ ', transferFactory.activeChip.value);
		}
	};

	/**
	 * Очищаем стол: скидываем размер ставки, скрываем белые кольца
	 */
	clearTableBet(){
		transferFactory.activeChip = undefined;
		this.floatChipContainer.hideFloatChip();
		this.gameField.hideHints();
	};

	getCoordsForBet(pos){
		return this.gameField.getCoordsForBet(pos);
	}
}