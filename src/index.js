import plugins from './plugins';
import config  from './config';
import Game from './Game';
import Background from './components/background/background';
import ChipView from './components/chip/ChipView';
import ButtonView from './components/button/ButtonView';
import GameController from './controllers/controller'
import {assetLoader} from './assetsLoader'

let game = new Game(config);

let gameCtrl = new GameController();

/**
 * Вешаем на кнопки свои обработчики из контроллера
 */
const buttonsCallbackConfig = {
	btnCancel: gameCtrl.cancelBtnClick,
	btnClear: gameCtrl.clearBtnClick,
	btnRepeat: gameCtrl.repeatBtnClick,
	btnX2: gameCtrl.x2BtnClick
};

/**
 * background
 */
let bg = new Background();
game.stage.addChild(bg);

/**
 * Прогружаем все json-атласы
 */
assetLoader(()=>{
	['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
		let chip = new ChipView(item, gameCtrl.chipClick, gameCtrl);
		game.stage.addChild(chip);
	});

	for(let key in buttonsCallbackConfig){
		let btn = new ButtonView(key, buttonsCallbackConfig[key], gameCtrl);
		game.stage.addChild(btn);
	}

	game.start();
});


