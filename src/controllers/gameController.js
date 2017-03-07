import PIXI from 'pixi.js';
import plugins from './../plugins';
import config  from './../config';
import Game from './../Game';
import Background from './../components/background/background';
import ChipView from './../components/chip/ChipView';
import ButtonView from './../components/button/ButtonView';
import {assetLoader} from './../assetsLoader'
import GameFiledBigController from './../components/gameFiledBig/gameFiledBigController';

export default class GameController {
	constructor(){
		this.game = new Game(config);
	}

	init(){
		console.log('init GameController');

		/**
		 * Вешаем на кнопки свои обработчики из контроллера
		 */
		const buttonsCallbackConfig = {
			btnCancel: this.cancelBtnClick,
			btnClear: this.clearBtnClick,
			btnRepeat: this.repeatBtnClick,
			btnX2: this.x2BtnClick
		};

		/**
		 * background
		 */
		let bg = new Background();
		this.game.stage.addChild(bg);

		let fieldBig = new GameFiledBigController();
		fieldBig.addToStage(this.game.stage);

		/**
		 * Прогружаем все json-атласы
		 */
		assetLoader(()=>{
			['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
				let chip = new ChipView(item, this.chipClick, this);
				this.game.stage.addChild(chip);
			});

			for(let key in buttonsCallbackConfig){
				let btn = new ButtonView(key, buttonsCallbackConfig[key], this);
				this.game.stage.addChild(btn);
			}

			this.game.start();
		});
	};






	chipClick(data){
		console.log('This is chipClick from controller', data, this);
	}

	cancelBtnClick(){
		console.log('This is cancelBtnClick from controller', this);
	}

	clearBtnClick(){
		console.log('This is clearBtnClick from controller', this);
	}

	x2BtnClick(){
		console.log('This is x2BtnClick from controller', this);
	}

	repeatBtnClick(){
		console.log('This is repeatBtnClick from controller', this);
	}
}