import presets from '../constants/presets'

export default class GameStore {
	constructor(config){
		this.states = {};

		this.betsCtrl = {};

		this.balance = config.balance;
	}
}