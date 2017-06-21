import serverMessages from './constants/serverMessages';

export default class Debugger {
	constructor() {
		this.toJs = {
			connect: toJs => {this.toJs = toJs;}
		};
	}

	fromJs(data) {
		data = JSON.parse(data);

		if(data.kind === "loaded_msg") {
			setTimeout(() => {
				this.toJs(JSON.stringify( serverMessages.init_msg[0] ));
			}, 0);


			// setTimeout(() => {
			// 	this.toJs(JSON.stringify( serverMessages.rand_msg[0] ));
			//
			// 	setTimeout(() => {
			// 		this.toJs(JSON.stringify( serverMessages.rand_msg[1] ));
			//
			// 		setTimeout(() => {
			// 			this.toJs(JSON.stringify( serverMessages.rand_msg[2] ));
			//
			// 			setTimeout(() => {
			// 				this.toJs(JSON.stringify( serverMessages.rand_msg[0] ));
			//
			// 			}, 5000)
			// 		}, 5000);
			// 	}, 5000);
			// }, 5000);


			// setTimeout(() => {
			// 	this.toJs(JSON.stringify( {error_code:401,error_ctx:"bet_error",kind:"error_msg"} ));
			// }, 2000);

		} else if(data.kind === 'bets_msg'){

			setTimeout(() => {
				this.toJs(JSON.stringify( serverMessages.bets_ok_msg ));
			}, 1000);

		} else if(data.kind === "exit_game_msg") {

			setTimeout(() => {
                this.toJs(JSON.stringify( { kind: "exit_msg" }  ));
            }, 1000);

        } else if(data.kind === "exited_msg") {

			alert("exit");

        }

	}
}


//window.cppObj = new Debugger();