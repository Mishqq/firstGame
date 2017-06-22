import globalSettings from './../../constants/globalSettings';

let componentSettings = {
	values: {
		chipSm0: globalSettings.betSums[0],
		chipSm1: globalSettings.betSums[1],
		chipSm2: globalSettings.betSums[2],
		chipSm3: globalSettings.betSums[3],
		chipSm4: globalSettings.betSums[4]
	},
	limits: globalSettings.betLimits,
	textStyles: {font: 'normal 14px Arial', fill : 'white', align : 'center'}
};

export default componentSettings;