import PIXI from 'pixi.js';

const path = './assets/images/';
let assets = [
	'anums.json',
	'bg_numbers.json',
	'blights.json',
	'buttons.json',
	'chips.json',
	'fields.json',
	'timer.json'
];

assets = assets.map((item)=>{
	return path + item;
});

function assetLoader(callback){
	PIXI.loader.add(assets).load(callback);
}

export {assetLoader}
