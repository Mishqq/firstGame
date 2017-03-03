import plugins from './plugins';
import config  from './config';
import Game from './Game';
import Bunny from './Bunny';
import Background from './components/background/background';
import ChipView from './components/chip/ChipView';

import {assetLoader} from './assetsLoader'


let game = new Game(config);

//Add the bunny
// let bunny = new Bunny();
// bunny.position.set(200,150);
// game.stage.addChild(bunny);


// background
let bg = new Background();
game.stage.addChild(bg);


PIXI.loader.add(["./assets/images/chips.json"]).load(()=>{
	let chip0Texture = PIXI.utils.TextureCache["chip0"];
	let chip0_tblTexture = PIXI.utils.TextureCache["chip0_tbl"];

	let dungeon = new PIXI.Sprite(chip0Texture);
	let dungeon1 = new PIXI.Sprite(chip0_tblTexture);

	game.stage.addChild(dungeon);
	game.stage.addChild(dungeon1);
});

// let chip = new ChipView();
// game.stage.addChild(chip);

/**
 * Прогружаем все json-атласы
 */
// assetLoader(()=>{
// 	game.start();
// });

game.start();


