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
	let str = value;
	str = str.toString();
	return (str.length > 3) ? str.substring(0, 1) + 'K' : value;
}

let _hf = {
	isPosInBounds,
	formatChipValue
};

export {_hf};