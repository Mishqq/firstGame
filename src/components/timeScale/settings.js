export default {
	position: {x: 725, y: 347},
	timeSetting: {
		time: 15,
		changeColorPer: 0.25,
		fps: 60
	},
	textStyle: {
		font: "normal 26px Arial",
		fontVariant: 'small-caps',
		wordWrapWidth: 0,
		fill: 'white',
	},
	states:[
		{scale: true, scaleValue: 1, text:'Приём ставок'},
		{scale: true, scaleValue: 0.25, text: 'Последние ставки'},
		{scale: true, scaleValue: 0, text: 'Ставок больше нет'},
		{scale: false, text: 'Идёт игра'},
		{scale: false, text: 'Выигрышное число'}
	]
}