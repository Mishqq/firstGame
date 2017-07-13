import serverMessages from './../constants/serverMessages';
import {_hf} from './../services/helpFunctions';

let nums = [];
for(let i=0; i<38; i+=1) nums.push(i);

// Алгоритм
// При получении fromJs('loaded_msg') отправляем  toJs('init_msg'/game_state==1)
// Затем по таймаутам начинаем отправлять последовательно toJs('rand_msg')
export default  class stateMachine{
	constructor(cppObj){
		this.cppObj = cppObj;

		this.randMsgCount = 1;

		this.randMsgTiming = [5, 10, 5]; // game_state 2[ball], 1, 2
	}

	getMessage(){

	}

	sendMessage(msg, time){
		time ?
			setTimeout(() => this.cppObj.toJs(JSON.stringify( msg )), time*1000) :
			this.cppObj.toJs(JSON.stringify( msg ));
	}

	startWork(){
		let sendRandMeg = ()=>{
			let randMsg = serverMessages.rand_msg[this.randMsgCount];
			if(this.randMsgCount === 2){
				let rundNum = _hf.randEl(nums);
				serverMessages.rand_msg[0].game_data.balls[0] = rundNum;
				randMsg.game_data.balls[0] = rundNum;
			}
			this.sendMessage(randMsg);

			if(++this.randMsgCount > 2) this.randMsgCount = 0;

			let thisStateTime = this.randMsgTiming[this.randMsgCount]*1000;
			this.timeoutId = setTimeout(sendRandMeg, thisStateTime);
		};

		this.timeoutId = setTimeout(sendRandMeg, this.randMsgTiming[ this.randMsgCount ]*1000);
	}

	stopWork(){
		clearTimeout(this.timeoutId);
	}

	sendErrorMessage(code, time){
		let msg = serverMessages.error_msg;
		if(code) msg.error_code = code;

		time ? setTimeout(() => this.sendMessage(msg), time*1000) : this.sendMessage(msg);
	}
}