import GameController from './components/game/gameController';
import serverMessages from './constants/serverMessages';
import {_hf} from './services/helpFunctions';

let server_confirm_bets;
let msgMapFn = data=>{
	data = JSON.parse( data );

	// Эмуляция удачного/неудачного ответа с сервера
	// if(data.kind !== "init_msg"){
	// 	let rand_server_msg = _hf.randEl([false, true]);
	// 	data.kind = rand_server_msg ?  'bets_ok_msg' : 'error_msg';
	// }

	if(data.kind === "init_msg") {

		gameCtrl.init(data.auth);

	} else if(data.kind === "auth_msg") {

	} else if(data.kind === "rand_msg") {

	} else if(data.kind === "bets_msg") {

		console.log('Делаем ставки ➠ ');
		gameCtrl.setServerBets(data.bets);

	} else if(data.kind === "bets_ok_msg") {

		console.log('Ставка прошла ➠ ');
		gameCtrl.confirmBets(true);

	} else if(data.kind === "error_msg") {

		console.log('Ставка не прошла ➠ ');
		gameCtrl.confirmBets(false);

	} else if(data.kind === "exit_msg") {

	} else if(data.kind === "srv_lost_msg") {

	} else if(data.kind === "loaded_msg") {

	} else if(data.kind === "exited_msg") {

	} else {
		console.log('Not founded message type')
	}
};

// Server emulate
if(!window.cppObj) {
	window.cppObj = {};

	cppObj.toJs = {connect: (toJs)=>{
		setTimeout(()=>{
			toJs();
		}, 1000);
	}};

	cppObj.fromJs = (data)=>{
		server_confirm_bets = data;
		cppObj.toJs.connect(()=>{
			console.log('data ➠ ', server_confirm_bets);
			msgMapFn(server_confirm_bets);
			server_confirm_bets = '';
		});
	}
}

let gameCtrl = new GameController(cppObj.fromJs);

cppObj.toJs.connect(()=>{
	msgMapFn(JSON.stringify(serverMessages.init_msg));
});

setTimeout(() => {
	cppObj.toJs.connect(()=>{
		msgMapFn(JSON.stringify(serverMessages.bets_msg));
	});
}, 2000);