let presets = {};

let limits = {min: 100, max: 30000};

let spriteGroups = ['chips', 'anums', 'bgNumbers', 'blights', 'buttons', 'fields', 'timer'];

presets.spriteStore = {};
spriteGroups.forEach((item)=>{
	presets.spriteStore[item] = {};
});


/**
 * Настройки для компонентов
 */
presets.settings = {
	game: {
		width: 1920,
		height: 1080,
		webgl: true, //false for 2dContext, true for autoDetectRenderer
		rendererOptions: {
			backgroundColor : 0x1099bb
		}
	},
	timeScale: {
		time: 10,
		changeColorPer: 0.25,
		fps: 60,
		lastTime: 3,
		viewResTime: 3
	},
	history: {
		rollTime: 13 // timeScale.time + timeScale.lastTime
	}
};


/**
 * Позиции компонентов на сцене
 */
presets.positions = {
	chips: {
		chip0: {x: 640, y: 957},
		chip1: {x: 800, y: 957},
		chip2: {x: 960, y: 957},
		chip3: {x: 1120, y: 957},
		chip4: {x: 1280, y: 957}
	},
	buttons: {
		btnCancel:     {x: 180, y: 934},
		btnClear:       {x: 410, y: 934},
		btnRepeat:      {x: 1450, y: 934},
		btnX2:          {x: 1570, y: 934}
	},
	fields: {
		big: {x: 200, y: 350},
		small: {x: 1200, y: 300}
	},
	timeScale: {x: 725, y: 320},
	infoPanel: {
		main: {x: 250, y: 120},
		limitsPanel: {x: 0, y: 0}, // Относительно infoPanel.main
		hotNumPanel: {x: 340, y: 0}, // Относительно infoPanel.main
		coldNumPanel: {x: 675, y: 0}, // Относительно infoPanel.main
		otherNumPanel: {x: 1010, y: 0} // Относительно infoPanel.main
	},
	betPanel: {
		main:           {x: 50, y: 50},
		fields: {
			fldBet:         {x: 320, y: -10},
			fldWin:         {x: 730, y: -10},
			fldBalance:     {x: 1560, y: -22}
		},
		numbers: {
			fldBet: {x: 20, y: 22},
			fldWin: {x: 20, y: 22},
			fldBalance: {x: 30, y: 34}
		}
	},
	history: {x: 0, y: 0}
};


/**
 * Дефолтные значения компонентов
 */
presets.data = {
	colorNumMap: {
		bgRed: [1,3,5,7,9, 12,14,16,18, 19,21,23,25,27, 30,32,34,36],
		bgBlack: [2,4,6,8, 10,11,13,15,17, 20,22,24,26, 28,29,31,33,35],
		bgZero: ['zero', 'doubleZero', 0]
	},
	// Значения ставок
	chipValues: {
		chip0: 100,
		chip1: 500,
		chip2: 1000,
		chip3: 2000,
		chip4: 3000
	},
	floatChipTypes: {
		100:    "fChip0",
		500:    "fChip1",
		1000:   "fChip2",
		2000:   "fChip3",
		3000:   "fChip4"
	},
	infoPanel: {
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
	history: {
		rollNumbers: ['zero', 'doubleZero', 1,2,3,4,5, 6,7,8,9,10, 11,12,13,14,15, 16,17,18,19,20, 21,22,23,24,25, 26,27,28,29,30, 31,32,33,34,35]
	},
	betPanel: {
		fldBet: 0,
		fldWin: 0,
		fldBalance: 10000
	}
};


/**
 * Дефолтные надписи
 */
presets.texts = {
	timeScale: {
		status0: 'Приём ставок',
		status1: 'Последние ставки',
		status2: 'Ставок больше нет',
		status3: 'Выигрышное число '
	},
	infoPanel: {
		limitBlock: [
			{type: 'labelText',     text: 'ЛИМИТЫ СТОЛА',       x: 110, y: 10},
			{type: 'gradientText',  text: 'CASINO ROULETTE',    x: 70,  y: 40},
			{type: 'gradientText',  text: 'MAX:',               x: 25,  y: 95},
			{type: 'gradientText',  text: 'MIN:',               x: 25,  y: 140}
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
	},
	button: {
		clear: 'Очистить',
		cancel: 'Отменить'
	},
	betPanel: {
		bet: {
			text: 'СТАВКА',
			pos: {x: 200, y: 0}
		},
		win: {
			text: 'ВЫИГРЫШ',
			pos: {x: 570, y: 0}
		},
		balance: {
			text: 'БАЛАНС',
			pos: {x: 1450, y: 0}
		}
	}
};

presets.limits = {
	min: limits.min,
	max: limits.max,
	1:  {min: limits.min || 100, max: 5000},
	2:  {min: limits.min || 100, max: 5000},
	3:  {min: limits.min || 100, max: 5000},
	4:  {min: limits.min || 100, max: 5000},
	5:  {min: limits.min || 100, max: 5000},
	6:  {min: limits.min || 100, max: 5000},
	12: {min: limits.min || 100, max: 5000},
	18: {min: limits.min || 100, max: 5000}
};

presets.coefficients = {
	1:  35, // single num
	2:  18, // 2 num
	3:  12, // column (3 num)
	4:  9,  // 4 num
	5:  6,  // basket (5 num)
	6:  6,  // 2 columns,
	12: 3,  // row / dozen
	18: 2   // odd / even / red / black / 1-18 / 19-36
};


/**
 * Стили для текстов
 */
presets.textStyles = {
	chipTextStyle: {
		font: 'bold 32px Arial',
		fill : 'white',
		align : 'center'
	},
	buttonStyle: {
		font: 'normal 26px Arial',
		fill : 'white',
		align : 'center'
	},
	chipSmTextStyle: {
		font: 'normal 14px Arial',
		fill : 'white',
		align : 'center'
	},
	floatChipTextStyle: {
		font: 'bold 20px Arial',
		fill : 'white',
		align : 'center'
	},
	filedClickAreaTextStyle: {
		font: "normal 18px Arial",
		wordWrapWidth: 0,
		fill: 'white',
		stroke: 'black',
		strokeThickness: 5
	},
	timeScale: {
		font: "normal 36px Arial",
		fontVariant: 'small-caps',
		wordWrapWidth: 0,
		fill: 'white',
	},
	infoPanel: {
		gradientText: {font: "24px info"},
		whiteText: {font: "normal 24px Arial", fill: 'white'},
		labelText: {font: "bold 18px Arial", fill: 'yellow', align: 'center'},
		number: {font: 'normal 30px Arial', fill: 'white', align: 'center'},
		amount: {font: 'normal 26px Arial', fill: 'white'}
	},
	betPanel: {
		font: "normal 24px Arial",
		fontVariant: 'small-caps',
		wordWrapWidth: 0,
		fill: 'white',
	},
	historyPanel: {
		small: {font: 'normal 30px Arial', fill: 'white', align: 'center'},
		big: {font: "bold 96px Arial", fontVariant: 'small-caps', wordWrapWidth: 0, fill: 'white',}
	}
};


export default presets;