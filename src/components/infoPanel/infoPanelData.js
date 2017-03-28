let defaultPanelData = {
	limitsPanel: {max: 30000, min: 10},
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
};

const colorNumMap = {
	bgRed: [1,3,5,7,9, 12,14,16,18, 19,21,23,25,27, 30,32,34,36],
	bgBlack: [2,4,6,8, 10,11,13,15,17, 20,22,24,26, 28,29,31,33,35],
};

const blockTexts = {
	limitBlock: [
		{type: 'labelText',     text: 'ЛИМИТЫ СТОЛА',       x: 110, y: 10},
		{type: 'gradientText',  text: 'CASINO ROULETTE',    x: 70,  y: 40},
		{type: 'gradientText',  text: 'MAX:',               x: 25,  y: 95},
		{type: 'gradientText',  text: 'MIN:',               x: 25,  y: 140},
		{type: 'whiteText',     text: '30 000',             x: 240, y: 95},
		{type: 'whiteText',     text: '10',                 x: 285, y: 140}
	],
	hotNumbers: [
		{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 100 ИГР',   x: 60, y: 10},
		{type: 'gradientText',  text: 'ГОРЯЧИЕ НОМЕРА',         x: 70,  y: 40}
	],
	coldNumbers: [
		{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 100 ИГР',   x: 60, y: 10},
		{type: 'gradientText',  text: 'ХОЛОДНЫЕ НОМЕРА',        x: 50,  y: 40}
	],
	otherNumbers: [
		{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 50 ИГР',   x: 60, y: 10},
		{type: 'gradientText',  text: 'RED',   x: 60, y: 40},
		{type: 'gradientText',  text: 'BLACK', x: 210,  y: 40},
		{type: 'gradientText',  text: 'ODD',   x: 30,  y: 120},
		{type: 'gradientText',  text: '0',     x: 150,  y: 120},
		{type: 'gradientText',  text: 'EVEN',  x: 240,  y: 120}
	]
};

export {blockTexts, colorNumMap, defaultPanelData};