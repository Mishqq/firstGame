import GameFieldView from './gameFieldView';
import {clickAreas} from './gameFieldCellMap';
import {defaultPositions} from './../../constants/defaultPositions';
import {transferFactory} from './../../servises/transferFactory'

export default class GameFieldController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			onHoverCb: this.hoverAreas,
			ctx: this
		};

		this._gameFieldBig = new GameFieldView(config);
	}

	/**
	 * Вешаем коллбек на клик по большому игровому полю
	 * @param event
	 */
	onClick(event){
		let localPos = event.data.getLocalPosition(this._gameFieldBig);
		this.getCellFromPos(localPos);
	}

	get gameFieldSprite(){
		return this._gameFieldBig.pixiContainer;
	}

	showHints(arr){
		this._gameFieldBig.showHints(arr);
	}

	hideHints(){
		this._gameFieldBig.hideHints();
	}

	/**
	 * Определение ячеек по клику на игровое поле
	 * @param pos
	 */
	getCellFromPos(pos){
		return clickAreas.find((item)=>{
			return pos.x >= item.x && pos.x < item.x+item.w && pos.y > item.y && pos.y < item.y + item.h
		});
	}

	/**
	 * Наведение на активные области
	 * @param event
	 * @returns {boolean}
	 */
	hoverAreas(event){
		if(!transferFactory.activeChip) return false;

		// т.к. событие mousemove и touchmove у нас отрабатывают по всей сцене
		// (не важно на что вешаем), то вычисляем координаты нужного поля относительно
		// сцены вручную
		let pos = {
			x: event.data.global.x - defaultPositions.fields.big.x,
			y: event.data.global.y - defaultPositions.fields.big.y
		};

		let cell = this.getCellFromPos(pos);

		this.hideHints();

		if(cell && cell.c.length){
			this.showHints(cell.c);
		}
	}

	/**
	 * /**
	 * Функция по переданным координатам возвращает координаты центра ячейки на игровом поле
	 * (используется для координат ставки)
	 * @param pos - {x, y}
	 * @param global - boolean, используем ли глобальные координаты, или координаты игрового поля
	 * @returns {x, y}
	 */
	getCoordsForBet(pos, global){
		//TODO сделать поддержку глобальных координат
		let cell = this.getCellFromPos(pos);

		return cell ? cell.center : false;
	}
}
