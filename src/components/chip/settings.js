import globalSettings from './../../constants/globalSettings';

let componentSettings = {
	position: {
		chip0: {x: 640, y: 957},
		chip1: {x: 800, y: 957},
		chip2: {x: 960, y: 957},
		chip3: {x: 1120, y: 957},
		chip4: {x: 1280, y: 957}
	},
	values: {
		chip0: globalSettings.betSums[0],
		chip1: globalSettings.betSums[1],
		chip2: globalSettings.betSums[2],
		chip3: globalSettings.betSums[3],
		chip4: globalSettings.betSums[4]
	},
	textStyle: {font: 'bold 32px Arial', fill : 'white', align : 'center'}
};

export default componentSettings;