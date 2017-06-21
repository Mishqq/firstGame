import serverMessages from './../constants/serverMessages';

// Алгоритм
// При получении fromJs('loaded_msg') отправляем  toJs('init_msg'/game_state==1)
// Затем по таймаутам начинаем отправлять последовательно toJs('rand_msg')
export default  class stateMachine{
	constructor(){
		this.randMsgCount = 1;

		this.randMsgTiming = [10, 5, 5];
	}

	getMessage(){

	}

	sendMessage(msg){
		console.log('msg ➠ ', msg, this.randMsgCount);
	}

	startWork(){
		this.sendMessage(serverMessages.init_msg[0]);

		this.timeoutId = setTimeout(() => sendRandMeg(), this.randMsgTiming[0]);

		let sendRandMeg = ()=>{
			this.sendMessage(serverMessages.rand_msg[this.randMsgCount]);

			if(this.randMsgCount++ > 2) this.randMsgCount = 0;

			this.timeoutId = setTimeout(sendRandMeg, this.randMsgTiming[this.randMsgCount]*1000);
		};
	}

	stopWork(){
		clearTimeout(this.timeoutId);
	}
}