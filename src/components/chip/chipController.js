import ChipView from './chipView';
import presets from './../../constants/presets';

//TODO: Переделатю вьюху: класс контейнера должен быть один, а не по количеству фишек

export default class ChipController {
	constructor(configFromGameCtrl) {
		this.cfg = configFromGameCtrl;

		this._chips = {};

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			let chip = new ChipView(item, {click: this.onClick, touchStart: this.chipTouchStart, ctx: this});
			this._chips[item] = chip;
		});
	}

	get chips(){
		return this._chips
	}

	onClick(price){
		let chipType = this.returnChipType(price),
		thisChip = this.chips[chipType];

		for(let key in this.chips){
			if(this.chips[key] === thisChip){
				thisChip.active ?
					thisChip.setDefault() :
					thisChip.setActive();
			} else if(this.chips[key].active) {
				this.chips[key].setDefault();
			}
		}

		let chip = thisChip.active ? thisChip.chipData() : undefined;

		// chipClick в gameController
		this.cfg.click.call(this.cfg.ctx, chip);
	}

	chipTouchStart(price){
		let chipType = this.returnChipType(price);
		let chip = {value: price, type: chipType};

		// chipTouchStart в gameController
		this.cfg.touchStart.call(this.cfg.ctx, chip);
	}

	disablePanel(){
		for(let key in this.chips){
			this.chips[key].disableChip();
		}
	}

	enablePanel(){
		for(let key in this.chips){
			this.chips[key].enableChip();
		}
	}

	/**
	 * Возвращает тип ставки по значению
	 * @param price
	 * @returns {*}
	 */
	returnChipType(price){
		let chipType;
		for(let key in presets.data.chipValues)
			if(presets.data.chipValues[key] === price) chipType = key;
		return chipType;
	}

	/**
	 * Возвращает объект активной фишки
	 * @returns {*}
	 */
	getActiveChip(){
		let chipActive;

		for(let chip in this.chips){
			if(this.chips[chip].active)
				chipActive = this.chips[chip];
		}

		return chipActive;
	}
}
