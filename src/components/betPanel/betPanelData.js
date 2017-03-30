let texts = {
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
};

let fields = {
	fldBet:         {x: 320, y: -10},
	fldWin:         {x: 730, y: -10},
	fldBalance:     {x: 1560, y: -22}
};

/**
 * Позиции данных задаются относительно спрайтов полей
 */
let numbers = {
	fldBet: {x: 20, y: 22},
	fldWin: {x: 20, y: 22},
	fldBalance: {x: 30, y: 34}
};

export {texts as betPanelText, fields, numbers}