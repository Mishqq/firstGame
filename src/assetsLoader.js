import PIXI from 'pixi.js';
import {spritesStore} from './spritesStore';
import {constants} from './constants/constants';

const loader = PIXI.loader;
const path = constants.path.assets + 'images/';
let assets = constants.loadAssets;

assets = assets.map((item)=>{
	return path + item;
});

/**
 * Функция загрузки json-атласов.
 * Создаёт спрайты и загоняет их в модуль spritesStore
 * В коллбеке передаём старт рендера
 * @param callback
 */
function assetLoader(callback){
	loader.add(assets);

	loader.load((loader, resources)=>{

		// Загоняем сырые данные из json-файлов в хранилище спрайтов (spritesStore) по группам
		for(let key in constants.namesMap){
			let spriteGroup = constants.namesMap[key]; // anums, chips, bgNumbers...

			for(let keyInGroup in spriteGroup){
				// keyInGroup for chips: chip0, chipSm0, chip1...
				spritesStore[key][keyInGroup] = PIXI.utils.TextureCache[ spriteGroup[keyInGroup] ];
			}
		}

		callback();
	});
}

export {assetLoader}
