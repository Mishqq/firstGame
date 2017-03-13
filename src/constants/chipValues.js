const chipValues = {
	chip0: 100,
	chip1: 500,
	chip2: 1000,
	chip3: 2000,
	chip4: 3000
};

let floatChipTypes = {},
	count = 0;
for(let key in chipValues){
	floatChipTypes[ chipValues[key] ] = 'fChip' + count++;
}

export {chipValues, floatChipTypes};