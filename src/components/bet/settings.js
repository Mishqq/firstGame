let limits = {min: 100, max: 30000};

export default {
	values: {
		chipSm0: 100,
		chipSm1: 500,
		chipSm2: 1000,
		chipSm3: 2000,
		chipSm4: 3000
	},
	limits: {
		min: limits.min,
		max: limits.max,
		1:  {min: limits.min || 100, max: 4000},
		2:  {min: limits.min || 100, max: 8000},
		3:  {min: limits.min || 100, max: 12000},
		4:  {min: limits.min || 100, max: 16000},
		5:  {min: limits.min || 100, max: 20000},
		6:  {min: limits.min || 100, max: 24000},
		12: {min: limits.min || 100, max: 28000},
		18: {min: limits.min || 100, max: 30000}
	},
	textStyles: {font: 'normal 14px Arial', fill : 'white', align : 'center'}
}