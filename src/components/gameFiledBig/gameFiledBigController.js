import PIXI from 'pixi.js';
import GameFiledBigView from './gameFiledBigView';
import {cellMap, clickAreas} from './gameFieldBigCellMap';

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
		console.log('pos ➠ ', pos);
		for(let row in cellMap){
			let rowRange = row.split('_');

			if(pos.x > rowRange[0] && pos.x < rowRange[1]){
				break;
			}
		}
	}
}
