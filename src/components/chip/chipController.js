import ChipView from './chipView';
import presets from './../../constants/presets';
import {betStore} from './../../servises/betStore'

//TODO: Переделатю вьюху: класс контейнера должен быть один, а не по количеству фишек

export default class ChipController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			chipTouchStartCb: this.chipTouchStart,
			ctx: this
		};

		this._chips = {};

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			let chip = new ChipView(item, config);
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

		betStore.activeChip = thisChip.active ?
			thisChip.chipData() : undefined;
	}

	chipTouchStart(price){
		let chipType = this.returnChipType(price);
		betStore.activeChip = {value: price, type: chipType};
	}

	disablePanel(){
		for(let key in this.chips){
			this.chips[key].disableChip();
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
