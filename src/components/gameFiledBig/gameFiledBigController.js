import PIXI from 'pixi.js';
import GameFiledBigView from './gameFiledBigView';
import GameFiledBigModel from './GameFiledBigModel';
import {clickAreas} from './gameFieldBigCellMap';

export default class GameFiledBigController {
	constructor() {
		this.gameFieldBig = new GameFiledBigView(this.clickCb, this);
	}

	/**
	 * Вешаем коллбек на клик по большому игровому полю
	 * @param event
	 */
	clickCb(event){
		console.log('click on gameField (big) from GameFiledBigController');
		let localPos = event.data.getLocalPosition(this.gameFieldBig);
		this.getCellFromPos(localPos);
	}

	/**
	 * Добавляем игровое поле на сцену
	 * @param stage
	 */
	addToStage(stage){
		stage.addChild(this.gameFieldBig);
	}


	getCellFromPos(pos){
		let cell = clickAreas.find((item)=>{
			return pos.x >= item.x && pos.x < item.x+item.w && pos.y > item.y && pos.y < item.y + item.h
		});

		console.log('cell.c ➠ ', cell.c);
	}
}
