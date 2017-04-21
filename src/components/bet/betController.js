import BetView from './betView';
import presets from './../../constants/presets';

export default class BetController {
	constructor(configByGameCtrl) {
		this._numbers = configByGameCtrl.info.numbers;
		this._type = configByGameCtrl.info.type;
		this._moreType = configByGameCtrl.info[ configByGameCtrl.info.type ];

		let config = configByGameCtrl;
		config.limits = presets.limits[ this._numbers.length ];

		this._betView = new BetView(config);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	get balance(){
		return this._betView.balance;
	}

	get numbers(){
		return this._numbers;
	}

	get type(){
		return this._type;
	}

	get moreType(){
		return this._moreType;
	}

	updateBet(value){
		this._betView.updateBet(value)
	}

	getTopChipValue(){
		return this._betView.getTopChipValue();
	}

	disableMove(){
		this._betView.disableMove();
	}

	enableMove(){
		this._betView.enableMove();
	}

	clearBet(){
		this._betView.clearBet();
	}
}