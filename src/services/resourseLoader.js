import PIXI from 'pixi.js';
import resourses from '../constants/resourses';
import presets from '../constants/presets';
// import 'yuki-createjs'
import 'yuki-createjs/lib/soundjs-0.6.2.combined'

/**
 * Звуки
 */
presets.gameSounds = {};
let soundPath = './assets/audio/';
let soundsArr = [];
for(let i=1; i<=8; i+=1)
	soundsArr.push({src: "0" + i + ".ogg", id:"sound0" + i})

let p1 = new Promise((resolve, reject) => {
	createjs.Sound.on("fileload", ()=>{
		presets.gameSounds = createjs.Sound;
		resolve();
	});
});
createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.registerSounds(soundsArr, soundPath);


/**
 * Картинки и атласы
 */
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
let p2 = new Promise((resolve, reject) => {
	setTimeout(resolve, 1000, "one");
	loader.add(assets);

	loader.load(()=>{
		// Загоняем сырые данные из json-файлов в хранилище спрайтов (spritesStore) по группам
		for(let key in resourses.namesMap){
			let spriteGroup = resourses.namesMap[key]; // anums, chips, bgNumbers...

			presets.spriteStore[key] = {};

			for(let keyInGroup in spriteGroup){
				// keyInGroup for chips: chip0, chipSm0, chip1...
				presets.spriteStore[key][keyInGroup] = PIXI.utils.TextureCache[ spriteGroup[keyInGroup] ];
			}
		}
		resolve();
	});
});


let assetLoader = (callback)=>{
	Promise.all([p1, p2]).then(value => {
		callback();
	}, reason => {
		console.log(reason)
	});
};

export {assetLoader};