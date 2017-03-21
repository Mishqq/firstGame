const touchEventsStore = {
	BET_TOUCH_START     : 'betTouchStart',
	BET_TOUCH_MOVE      : 'betTouchMove',
	CHIP_TOUCH_START    : 'chipTouchStart',
	CHIP_TOUCH_MOVE     : 'chipTouchMove',
	FLOAT_CHIP_MOVE     : 'floatChipMove'
};

class touchEventsClass{
	constructor(){
		this._touchStates = {};
		for(let key in touchEventsStore){
			this._touchStates[ touchEventsStore[key] ] = false;
		}
	}

	/**
	 * Вовзращает/устанавливает активное состояние
	 * @returns {*}
	 */
	get touchState(){
		let activeState;
		for(let key in this._touchStates){
			activeState = this._touchStates[key] ? key : 'undefined';
		}
		return activeState;
	}

	clearEvents(){
		for(let key in this._touchStates){
			this._touchStates[key] = false;
		}
	}

	cancelEvent(event){
		this._touchStates[event] = false;
	}

	setEvent(event){
		this.clearEvents();
		this._touchStates[event] = true;
	}

	isActive(event){
		return this._touchStates[event];
	}
}

let instance = new touchEventsClass();
Object.freeze(instance);

export {touchEventsStore as _tevStore, instance as _tev};
