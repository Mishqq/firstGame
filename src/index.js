import "babel-polyfill";
import GameController from './components/game/gameController';
import Debugger from './debugger';
import serverEmulate from './services/serverEmulate';

import {updateSettings as betUpdateSettings} from './components/bet/settings';

if(!window.cppObj) {
	window.cppObj = new Debugger();
	let stateMachine = new serverEmulate(window.cppObj);
	stateMachine.startWork();

	//stateMachine.sendErrorMessage(402, 2)
	//stateMachine.sendMessage(serverMessages.bets_msg, 3)
}


let gameCtrl = new GameController((...ars)=>cppObj.fromJs(...ars));
gameCtrl.init((...ars)=>cppObj.fromJs(...ars));

let msgMapFn = dataFromServer=>{
	let data = JSON.parse( dataFromServer );

	if(data.kind === "init_msg") {

		gameCtrl.initMessageHandler(data.game_data, data.auth, data.bets);

	} else if(data.kind === "auth_msg") {

	} else if(data.kind === "rand_msg") {

		gameCtrl.randMessageHandler(data.game_data);

	} else if(data.kind === "bets_msg") {

		console.log('Делаем ставки ➠ ');
		gameCtrl.setServerBets(data.bets);

	} else if(data.kind === "bets_ok_msg") {

		gameCtrl.confirmBets(data);

	} else if(data.kind === "error_msg") {

		gameCtrl.errorsHandler(data.error_code);

	} else if(data.kind === "exit_msg") {
		setTimeout(() => window.cppObj.fromJs(JSON.stringify({kind: "exited_msg"})), 1000);
	} else if(data.kind === "srv_lost_msg") {

	} else if(data.kind === "loaded_msg") {

	} else if(data.kind === "exited_msg") {

	} else {
		console.log('Not founded message type')
	}
};

cppObj.toJs.connect(msgMapFn);