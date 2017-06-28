let globalSettings = {
	numColor: {
		bgRed: [1,3,5,7,9, 12,14,16,18, 19,21,23,25,27, 30,32,34,36],
		bgBlack: [2,4,6,8, 10,11,13,15,17, 20,22,24,26, 28,29,31,33,35],
		bgZero: [0, 37]
	},
	betSums: null,
	betLimits: null
};

let defaultSettings = {
	"bet_sums": ["100", "200", "500", "1000", "3000"],
	"bet_limits": {
		"1": {"min": "100", "max": "3000"},
		"2": {"min": "100", "max": "3000"},
		"3": {"min": "100", "max": "3000"},
		"4": {"min": "100", "max": "3000"},
		"5": {"min": "100", "max": "3000"},
		"6": {"min": "100", "max": "3000"},
		"12": {"min": "100", "max": "3000"},
		"18": {"min": "100", "max": "3000"}
	}
};

window.cppObj && window.cppObj.gameSettings ?
	console.log('window.cppObj.gameSettings() ➠ ', window.cppObj.gameSettings()) :
	console.log('Нет настроек с сервера, будут использованы дефолтные данные:', defaultSettings);

let setData = window.cppObj && window.cppObj.gameSettings ?
	JSON.parse(window.cppObj.gameSettings()) : defaultSettings;


setData.bet_sums.forEach((item, idx, arr) => arr[idx] = +item);
for(let key in setData.bet_limits){
	let limitObj = setData.bet_limits[key];
	limitObj.min = +limitObj.min;
	limitObj.max = +limitObj.max;
}

globalSettings.betSums = setData.bet_sums;
globalSettings.betLimits = setData.bet_limits;

export default globalSettings