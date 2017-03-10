import GameFieldView from './gameFieldView';
import {clickAreas} from './gameFieldCellMap';

export default class GameFieldController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			ctx: this
		};

		this._gameFieldBig = new GameFieldView(config);
	}

	/**
	 * Вешаем коллбек на клик по большому игровому полю
	 * @param event
	 */
	onClick(event){
		console.log('click on gameField (big) from GameFiledBigController');
		let localPos = event.data.getLocalPosition(this._gameFieldBig);
		this.getCellFromPos(localPos);
	}

	get gameFieldSprite(){
		return this._gameFieldBig;
	}

	/**
	 * Определение ячеек по клику на игровое поле
	 * @param pos
	 */
	getCellFromPos(pos){
		let cell = clickAreas.find((item)=>{
			return pos.x >= item.x && pos.x < item.x+item.w && pos.y > item.y && pos.y < item.y + item.h
		});

		if(cell){
			console.log('cell.c ➠ ', cell.c);
		}
	}
}
