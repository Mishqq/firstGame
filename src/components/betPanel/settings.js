export default {
	position: {
		main:           {x: 50, y: 50},
		fields: {
			fldBet:         {x: 320, y: -10},
			fldWin:         {x: 730, y: -10},
			fldBalance:     {x: 1430, y: -22}
		},
		numbers: {
			fldBet: {x: 20, y: 22},
			fldWin: {x: 20, y: 22},
			fldBalance: {x: 30, y: 34}
		}
	},
	texts: {
		bet: {text: 'СТАВКА', pos: {x: 200, y: 0}},
		win: {text: 'ВЫИГРЫШ', pos: {x: 570, y: 0}},
		balance: {text: 'БАЛАНС', pos: {x: 1310, y: 0}}
	},
	textStyle: {
		font: "normal 24px Arial",
		fontVariant: 'small-caps',
		wordWrapWidth: 0,
		fill: 'white',
	}
}