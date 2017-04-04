import PIXI from 'pixi.js';
import resourses from './constants/resourses';
import presets from './constants/presets';

const loader = PIXI.loader;
const path = resourses.path.assets;
let assets = resourses.loadAssets;

assets = assets.map((item)=>{
	let str = new RegExp('xml');
	let path2 = str.test(item) ? path + 'fonts/info/' :  path + 'images/';
	return path2 + item;
});

/**
 * Функция загрузки json-атласов.
 * Создаёт спрайты и загоняет их в модуль spritesStore
 * В коллбеке передаём старт рендера
 * @param callback
 */
function assetLoader(callback){
	loader.add(assets);

	loader.load(()=>{
		// Загоняем сырые данные из json-файлов в хранилище спрайтов (spritesStore) по группам
		for(let key in resourses.namesMap){
			let spriteGroup = resourses.namesMap[key]; // anums, chips, bgNumbers...

			for(let keyInGroup in spriteGroup){
				// keyInGroup for chips: chip0, chipSm0, chip1...
				presets.spriteStore[key][keyInGroup] = PIXI.utils.TextureCache[ spriteGroup[keyInGroup] ];
			}
		}

		callback();
	});
}

export default assetLoader;