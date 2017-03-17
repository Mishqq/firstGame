/**
 * Проверка принадлежности по координатам
 * @param pos - {x, y}
 * @param bounds - {x, y, width, height}
 */
function isPosInBounds(pos, bounds){
	return pos.x >= bounds.x && pos.x <= (bounds.x + bounds.width) &&
		pos.y >= bounds.y && pos.y <= (bounds.y + bounds.height);
}

/**
 * Форматирование значения ставки
 * @param value
 * @returns {string}
 */
function formatChipValue(value){
	let str = (value >= 1000) ? value/1000 + 'K' : value;
	return str;
}

let _hf = {
	isPosInBounds,
	formatChipValue
};

export {_hf};