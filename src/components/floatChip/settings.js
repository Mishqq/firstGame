import globalSettings from './../../constants/globalSettings';

let componentSettings = {
	data: {},
	textStyle: {
		font: 'bold 20px Arial',
		fill : 'white',
		align : 'center'
	}
};

globalSettings.betSums.forEach((item, idx) => {
	componentSettings.data[item] = "chipSm" + idx;
});

export default componentSettings;