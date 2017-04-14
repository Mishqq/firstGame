import GameController from './controllers/gameController';
import serverMessages from './constants/serverMessages';

// Server emulate
if(!window.cppObj) {
	window.cppObj = {};

	cppObj.toJs = {connect: (toJs)=>{
		setTimeout(()=>{
			toJs();
		}, 1000);
	}};

	cppObj.fromJs = (data)=>{
		console.log('fromJs data', data);
	}
}

let gameCtrl = new GameController(cppObj.fromJs);

cppObj.toJs.connect(data=>{
	// data = JSON.parse( JSON.stringify(serverMessages.init_msg) );

	data = serverMessages.init_msg;

	if(data.kind === "init_msg") {
		gameCtrl.init({user: data.auth, games: data.games});
	} else if(data.kind === "auth_msg") {

	} else if(data.kind === "rand_msg") {

	} else if(data.kind === "bets_msg") {

	} else if(data.kind === "bets_ok_msg") {

	} else if(data.kind === "error_msg") {

	} else if(data.kind === "exit_msg") {

	} else if(data.kind === "srv_lost_msg") {

	} else if(data.kind === "loaded_msg") {

	} else if(data.kind === "exited_msg") {

	} else {
		console.log('Not founded message type')
	}
});