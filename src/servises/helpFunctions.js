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

/**
 * Преобразовываем число в формат x xxx xxx xxx
 * @param num
 * @returns {*}
 */
function formatLimit(num){
	let numArr = num.toString().split('');

	if(numArr.length < 4) {
		return num;
	} else {
		numArr.reverse();
		let cnt = 0;
		for(let i=0; i<numArr.length; i++){
			if((i+1-cnt)%3 === 0){
				numArr.splice(i+1, 0, ' ');
				i++;
				cnt++;
			}
		}
		let finalCut = numArr.reverse().join('');
		return finalCut;
	}
}

let _hf = {
	isPosInBounds,
	formatChipValue,
	formatLimit
};

export {_hf};