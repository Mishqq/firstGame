import globalSettings from './../../constants/globalSettings';

export default {
	position: {
		main: {x: 250, y: 120},
		limitsPanel: {x: 0, y: 0}, // Относительно infoPanel.main
		hotNumPanel: {x: 340, y: 0}, // Относительно infoPanel.main
		coldNumPanel: {x: 675, y: 0}, // Относительно infoPanel.main
		otherNumPanel: {x: 1010, y: 0} // Относительно infoPanel.main
	},
	texts: {
		limitBlock: [
			{type: 'labelText',     text: 'ЛИМИТЫ СТОЛА',       x: 120, y: 15},
			{type: 'gradientText',  text: 'CASINO ROULETTE',    x: 90,  y: 40},
			{type: 'gradientText',  text: 'MAX:',               x: 25,  y: 95},
			{type: 'gradientText',  text: 'MIN:',               x: 25,  y: 140}
		],
		hotNumbers: [
			{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 100 ИГР',   x: 80, y: 15},
			{type: 'gradientText',  text: 'ГОРЯЧИЕ НОМЕРА',         x: 80,  y: 40}
		],
		coldNumbers: [
			{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 100 ИГР',   x: 80, y: 15},
			{type: 'gradientText',  text: 'ХОЛОДНЫЕ НОМЕРА',        x: 70, y: 40}
		],
		otherNumbers: [
			{type: 'labelText',     text: 'ЗА ПОСЛЕДНИЕ 50 ИГР',   x: 85, y: 15},
			{type: 'gradientText',  text: 'RED',   x: 60, y: 40},
			{type: 'gradientText',  text: 'BLACK', x: 220,  y: 40},
			{type: 'gradientText',  text: 'ODD',   x: 40,  y: 120},
			{type: 'gradientText',  text: '0',     x: 150,  y: 120},
			{type: 'gradientText',  text: 'EVEN',  x: 250,  y: 120}
		]
	},
	textStyle: {
		gradientText: {font: "20px info"},
		whiteText: {font: "normal 18px Arial", fill: 'white'},
		labelText: {font: "bold 14px Arial", fill: 0xFFE144, align: 'center'},
		number: {font: 'normal 26px Arial', fill: 'white', align: 'center'},
		amount: {font: 'normal 22px Arial', fill: 'white'}
	},
	numColor: globalSettings.numColor
}