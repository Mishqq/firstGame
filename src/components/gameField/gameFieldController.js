import GameFieldView from './gameFieldView';
import {clickAreas} from './gameFieldCellMap';
import presets from './../../constants/presets';

export default class GameFieldController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

		this._gameFieldBig = new GameFieldView({click: this.onClick, hover: this.hoverAreas, ctx: this});
	}

	/**
	 * Вешаем коллбек на клик по большому игровому полю
	 * @param event
	 */
	onClick(event){
		this.cfg.setBet.call(this.cfg.ctx, event);
	}

	get pixiSprite(){
		return this._gameFieldBig.pixiContainer;
	}

	showHints(arr){
		this._gameFieldBig.showHints(arr);
	}

	hideHints(){
		this._gameFieldBig.hideHints();
	}



	showWinNum(num){
		this._gameFieldBig.showWinHunHint(num);
	}
	hideWinNum(){
		this._gameFieldBig.hideWinHint();
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
		if(!this.cfg.checkChips.call(this.cfg.ctx)) return false;

		// т.к. событие mousemove и touchmove у нас отрабатывают по всей сцене
		// (не важно на что вешаем), то вычисляем координаты нужного поля относительно
		// сцены вручную
		let pos = {
			x: event.data.global.x - presets.positions.fields.big.x,
			y: event.data.global.y - presets.positions.fields.big.y
		};

		let cell = this.getCellFromPos(pos);

		this.hideHints();

		if(cell && cell.c.length) this.showHints(cell.c);
	}

	/**
	 * /**
	 * Функция по переданным координатам возвращает координаты центра ячейки на игровом поле
	 * (используется для координат ставки)
	 * @param pos - {x, y}
	 * @param global - boolean, используем ли глобальные координаты, или координаты игрового поля
	 * @returns {x, y}
	 */
	getDataForBet(pos, global){
		if(global){
			pos.x -= presets.positions.fields.big.x;
			pos.y -= presets.positions.fields.big.y;
		}

		let cell = this.getCellFromPos(pos);

		if(cell && !cell.cells){
			// Если к ячейке привязаны только её координаты

			let center = !global ? cell.center :
				{x: cell.center.x + presets.positions.fields.big.x,
					y: cell.center.y + presets.positions.fields.big.y};

			return {center: center, numbers: cell.c};
		} else if(cell && cell.cells) {
			// Если к ячейке привязаны координаты других ячеек ~~SnakeBet
			let centers = [];

			cell.cells.forEach((item) => {
				let center = !global ? item.center :
					{x: item.center.x + presets.positions.fields.big.x,
						y: item.center.y + presets.positions.fields.big.y};

				centers.push({center: center, numbers: item.c})
			});

			return centers;
		}
	}

	disableField(){
		this._gameFieldBig.disableField();
	}

	enableField(){
		this._gameFieldBig.enableField();
	}
}
