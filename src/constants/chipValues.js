const chipValues = {
	chip0: 100,
	chip1: 500,
	chip2: 1000,
	chip3: 2000,
	chip4: 3000
};

const smallChipTypes = {
	chipSm0: chipValues.chip0,
	chipSm1: chipValues.chip1,
	chipSm2: chipValues.chip2,
	chipSm3: chipValues.chip3,
	chipSm4: chipValues.chip4
};

let floatChipTypes = {},
	count = 0;
for(let key in chipValues){
	floatChipTypes[ chipValues[key] ] = 'fChip' + count++;
}

export {chipValues, smallChipTypes, floatChipTypes};