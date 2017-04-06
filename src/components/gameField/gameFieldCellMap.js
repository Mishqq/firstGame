// Размер ячейки
let cs = {w: 53, h:52, evs: 184, odds: 132};

let clickAreas = [
	{type: 'zero', x:0, y:0, w:80, h:158, c:['doubleZero']}, //zero
	{x:0, y:158, w:80, h:158, c:['zero']}, //zeroZero
	{x:1363, y:0, w:78, h:105, c:[3,6,9,12, 15,18,21,24, 27,30,33,36]}, //2b1_row1
	{x:1363, y:105, w:78, h:105, c:[2,5,8,11, 14,17,20,23, 26,29,32,35]}, //2b1_row2
	{x:1363, y:210, w:78, h:105, c:[1,4,7,10, 13,16,19,22, 25,28,31,34]}, //2b1_row3
	{x:105, y:341, w:420, h:52, c:[1,2,3,4,5,6,7,8,9,10,11,12]}, //1st12
	{x:525, y:341, w:420, h:52, c:[13,14,15,16,17,18,19,20,21,22,23,24]}, //2st12
	{x:945, y:341, w:420, h:52, c:[25,26,27,28,29,30,31,32,33,34,35,36]}, //3st12
	{x:105, y:393, w:210, h:76, c:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]}, //1to18
	{x:1155, y:393, w:210, h:76, c:[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]}, //19to36
	{x:315, y:393, w:210, h:76, c:[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]}, //even
	{x:945, y:393, w:210, h:76, c:[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35]}, //odd
	{x:525, y:393, w:210, h:76, c:[1,3,5,7,9, 12,14,16,18, 19,21,23,25,27, 30,32,34,36]}, //red
	{x:735, y:393, w:210, h:76, c:[2,4,6,8, 10,11,13,15,17, 20,22,24,26, 28,29,31,33,35]}, //black

	// zero, doubleZero + 1,2,3 ~ "Корзина"
	{x:80, y:290, w: cs.w, h: cs.h, c:['zero','doubleZero',1,2,3]},
	{x:80, y:238, w: cs.w, h: cs.h, c:['zero',1]},
	{x:80, y:186, w: cs.w, h: cs.h, c:['zero',1,2]},
	{x:80, y:134, w: cs.w, h: cs.h, c:['zero','doubleZero',2]},
	{x:80, y:82, w: cs.w, h: cs.h, c:['doubleZero',2,3]},
	{x:80, y:0, w: cs.w, h: cs.h+30, c:['doubleZero',3]},

	// 34,35,36
	{x:1287, y:290, w:53, h: cs.h, c:[34,35,36]}, {x:1287, y:238, w:78, h: cs.h, c:[34]},
	{x:1287, y:186, w:78, h: cs.h, c:[34,35]}, {x:1287, y:134, w:78, h: cs.h, c:[35]},
	{x:1287, y:82, w:78, h: cs.h, c:[35,36]}, {x:1287, y:0, w: 78, h: cs.h+30, c:[36]},

	// snake
	// {x:1340, y:290, w:54, h:52, c:[1,5,9,12,14,16,19,23,27,30,32,34]}
	// {x:1340, y:290, w:54, h:52, c:[1,5,9,12,14,16,19,23,27,30,32,34], pos: [
	// 	{x: 1287, y: 238}, {x: 1182, y: 134}, {x: 1077, y: 0},
	// 	{x: 972, y: 0}, {x: 867, y: 134}, {x: 762, y: 238},
	// 	{x: 657, y: 238}, {x: 552, y: 134}, {x: 447, y: 0},
	// 	{x: 342, y: 0}, {x: 237, y: 134}, {x: 132, y: 238}
	// ]}
];

// templates for other filed cells
let rows = {
	odd: [
		{x: cs.odds, y:290, w: cs.w-1, h: cs.h, c:[1,2,3]}, {x: cs.odds, y:238, w: cs.w-1, h: cs.h, c:[1]},
		{x: cs.odds, y:186, w: cs.w-1, h: cs.h, c:[1,2]}, {x: cs.odds, y:134, w: cs.w-1, h: cs.h, c:[2]},
		{x: cs.odds, y:82, w: cs.w-1, h: cs.h, c:[2,3]}, {x: cs.odds, y:0, w: cs.w-1, h:82, c:[3]}
	],
	even: [
		{x: cs.evs, y:290, w: cs.w, h: cs.h, c:[1,2,3,4,5,6]}, {x: cs.evs, y:238, w: cs.w, h: cs.h, c:[1,4]},
		{x: cs.evs, y:186, w: cs.w, h: cs.h, c:[1,2,4,5]}, {x: cs.evs, y:134, w: cs.w, h: cs.h, c:[2,5]},
		{x: cs.evs, y:82, w: cs.w, h: cs.h, c:[2,3,5,6]}, {x: cs.evs, y:0, w: cs.w, h: cs.h+30, c:[3,6]},
	]
};

function addCellToField(originObj, dx, idx, idxInRow){
	let originObjEx = {x: originObj.x+dx, c: originObj.c.map((originObj)=>{return originObj+3*idx})};
	if(idxInRow === 5){
		originObjEx.center = {
			y: originObj.y + 2*originObj.h/3,
			x: originObjEx.x + originObj.w/2,
		}
	}
	let obj = Object.assign({},originObj, originObjEx);
	clickAreas.push(obj)
}

// Добавляем все остальные ячейки для поля
for(let i=0; i<11; i+=1){
	rows.odd.forEach((item, idxInRow)=>{
		addCellToField(item, i*cs.w*2-i, i, idxInRow);
	});

	rows.even.forEach((item, idxInRow)=>{
		addCellToField(item, i*cs.w*2-i, i, idxInRow);
	})
}

clickAreas.forEach((cell)=>{
	if(!cell.center)
		cell.center = {x: cell.x + cell.w/2, y: cell.y + cell.h/2};
});

let snakeCell = {x:1340, y:290, w:54, h:52, c:[1,5,9,12,14,16,19,23,27,30,32,34], cells: []};
clickAreas.forEach((item) => {
	let _c = item.c, _l = _c.length, _cn = _c[0];
	if(_l === 1){
		if(_cn === 1 || _cn === 5 || _cn === 9 || _cn === 12 || _cn === 14 || _cn === 16 ||
			_cn === 19 || _cn === 23 || _cn === 27 || _cn === 30 || _cn === 32 || _cn === 34){
			snakeCell.cells.push(item)
		}
	}
});
clickAreas.push(snakeCell);

/**
 * У каждой ячейки с цифрой на поле задаётся координата, куда будет отрисовываться кольцо
 */
let pointMap = {};
let starts = {x:158, y:263};
let count = 1;

for(let i=0; i<12; i+=1){
	let x = starts.x + cs.w*2*i-i;
	for(let j=0; j<3; j+=1){
		let y = starts.y - cs.w*2*j;
		pointMap[ count++ ] = {x, y};
	}
}
pointMap.doubleZero = {x:0, y:0, w:105, h:158};
pointMap.zero       = {x:0, y:158, w:105, h:158};


let winHintPos = {};
for(let i=0; i<12; i+=1){
	for(let j=3; j>0; j-=1){
		winHintPos[j + i*3] = {x:105*(i+1), y:315-105*j, w:105, h:105}
	}
}
winHintPos['zero'] = {x:0, y:157, w:105, h:157};
winHintPos['doubleZero'] = {x:0, y:0, w:105, h:157};

export {clickAreas, pointMap, winHintPos};