import ButtonView from './buttonPanelView';

export default class ButtonController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;

		// Конфиг, который передаём во вьюху
		const buttonsCallbackConfig = {
			// btnCancel: {
			// 	onClickCb: this.btnCancel,
			// 	ctx: this
			// },
			btnClear: {
				onClickCb: this.btnClear,
				ctx: this
			},
			btnRepeat: {
				onClickCb: this.btnRepeat,
				ctx: this
			},
			btnX2: {
				onClickCb: this.btnX2,
				ctx: this
			}
		};

		this._buttons = []; // коллекция спрайтов панели кнопок
		this._buttonClasses = []; // коллекция инстансов классов вьюх панели кнопок

		for(let key in buttonsCallbackConfig){
			let btn = new ButtonView(key, buttonsCallbackConfig[key]);
			this._buttonClasses.push(btn);
			this._buttons.push(btn.getPixiSprite);
		}
	}

	get buttons(){
		return this._buttons
	}

	disablePanel(){
		this._buttonClasses.forEach((btnView)=>{
			btnView.btnDisable();
		})
	};

	enablePanel(){
		this._buttonClasses.forEach((btnView)=>{
			btnView.btnDefault();
		})
	};

	btnCancel(){
		if(this._cfg && this._cfg.cancel){
			this._cfg.cancel.call(this._cfg.ctx)
		} else {
			console.log('cancel (ButtonPanelController)');
		}
	}

	btnClear(){
		if(this._cfg && this._cfg.clear){
			this._cfg.clear.call(this._cfg.ctx)
		} else {
			console.log('clear (ButtonPanelController)');
		}
	}

	btnRepeat(){
		if(this._cfg && this._cfg.repeat){
			this._cfg.repeat.call(this._cfg.ctx)
		} else {
			console.log('repeat (ButtonPanelController)');
		}
	}

	btnX2(){
		if(this._cfg && this._cfg.x2){
			this._cfg.x2.call(this._cfg.ctx)
		} else {
			console.log('x2 (ButtonPanelController)');
		}
	}
}
