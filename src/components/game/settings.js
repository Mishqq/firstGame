import timeScaleSettings from './../timeScale/settings';
import gameFieldSettings from './../gameField/settings';
import globalSettings from './../../constants/globalSettings';

let limits = {min: 0, max: 0};

for(let key in globalSettings.betLimits){
	if(limits.min === 0) limits.min = globalSettings.betLimits[key].min;
	if(limits.max === 0) limits.max = globalSettings.betLimits[key].max;

	if(limits.min > globalSettings.betLimits[key].min) limits.min = globalSettings.betLimits[key].min;
	if(limits.max < globalSettings.betLimits[key].max) limits.max = globalSettings.betLimits[key].max;

}

let coefficients = window.coefficients || {
		1:  35, // single num
		2:  18, // 2 num
		3:  12, // column (3 num)
		4:  9,  // 4 num
		5:  6,  // basket (5 num)
		6:  6,  // 2 columns,
		12: 3,  // row / dozen
		18: 2   // odd / even / red / black / 1-18 / 19-36
	};

for(let key in coefficients)
	coefficients[key] = +coefficients[key];

export default {
	game: {
		width: 1920,
		height: 1080,
		webgl: true, //false for 2dContext, true for autoDetectRenderer
		rendererOptions: {
			backgroundColor : 0x1099bb
		}
	},
	coefficients: coefficients,
	infoPanelData: {
		limitsPanel: {max: limits.max, min: limits.min},
		hotNumPanel: [
			{number: 34, amount: 37},
			{number: 17, amount: 19},
			{number: 23, amount: 47},
			{number: 15, amount: 98}
		],
		coldNumPanel: [
			{number: 33, amount: 7},
			{number: 16, amount: 2},
			{number: 22, amount: 5},
			{number: 14, amount: 8}
		],
		otherNumPanel: {red: 12, black: 38, odd: 10, even: 39, zero: 1}
	},
	gameField: gameFieldSettings.position,
	timeScale: timeScaleSettings.timeSetting
}