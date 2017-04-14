import ChipView from './chipView';
import presets from './../../constants/presets';

//TODO: Переделатю вьюху: класс контейнера должен быть один, а не по количеству фишек

export default class ChipController {
	constructor(configFromGameCtrl) {
		this.cfg = configFromGameCtrl;

		// this._chips = {};
		//
		// ['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
		// 	let chip = new ChipView(item, {click: this.onClick, touchStart: this.chipTouchStart, ctx: this});
		// 	this._chips[item] = chip;
		// });

		this._chipsView = new ChipView({click: this.onClick, touchStart: this.chipTouchStart, ctx: this});
	}

	get chips(){
		return this._chipsView._chips
	}

	get pixiSprite(){
		return this._chipsView.pixiSprite
	}

	onClick(price){
		let chipType = this.returnChipType(price),
			thisChip = this.chips[chipType];

		if(this._chipsView.activeChip === thisChip){
			this._chipsView.setDefault(this._chipsView.activeChip)
		} else {
			if(this._chipsView.activeChip)
				this._chipsView.setDefault(this._chipsView.activeChip);

			this._chipsView.setActive(thisChip)
		}

		let chipData = this._chipsView.activeChip ?
			this._chipsView.chipData(this._chipsView.activeChip) : undefined;

		// chipClick в gameController
		this.cfg.click.call(this.cfg.ctx, chipData);
	}

	chipTouchStart(price){
		let chipType = this.returnChipType(price);
		let chip = {value: price, type: chipType};

		// chipTouchStart в gameController
		this.cfg.touchStart.call(this.cfg.ctx, chip);
	}

	disable(){
		this._chipsView.disableChips();
	}

	enable(){
		this._chipsView.enableChips();
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

	chipData(chip){
		return this._chipsView.chipData(chip);
	}

	/**
	 * Возвращает объект активной фишки
	 * @returns {*}
	 */
	getActiveChip(){
		return this._chipsView.activeChip;
	}
}
