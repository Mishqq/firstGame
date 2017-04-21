import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../src/constants/PIXIabbr';

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


/**
 * Определение цвета подложки для цифры
 * @param map
 * @param num
 * @returns {*}
 */
function colorType(map, num){
	let color;
	for(let key in map)
		if(~map[key].indexOf(num)) color = key;

	if(num === 37) num = '00';

	return color;
}


/**
 * Добавляет текстуру текста к спрайту
 * @param sprite - спрайт, к которому добавляем текст
 * @param pos - {x, y}, положение текста в спрайте
 * @param text - сам текст
 * @param style - стиль текста
 */
function addTextToSprite(sprite, pos, text, style){
	let textSprt = new _pxT(text, style);
	textSprt.anchor.set(0.5, 0.5);
	textSprt.position = pos;

	sprite.addChild(textSprt);
}

/**
 * Возвращаем случайный элемент массива
 * @param arr
 * @returns {number}
 */
function randEl(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Возвращаем класс сущности
 * @param ent
 * @returns {string}
 */
function getClass(ent){
	let str = Object.prototype.toString.call(ent);
	let type = str.substr(8, str.length-9).toLowerCase();

	return type;
}

// Warn if overriding existing method
if(Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array, full) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time
	if (this.length != array.length)
		return false;

	if(full){
		this.sort();
		array.sort();
	}

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;
		}
		else if (this[i] != array[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


let _hf = {
	isPosInBounds,
	formatChipValue,
	formatLimit,
	colorType,
	addTextToSprite,
	randEl,
	getClass
};

export {_hf};