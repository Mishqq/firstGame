import ButtonView from './buttonPanelView';

export default class ButtonController {
	constructor(cfgFromGameCtrl) {
		// Конфиг, пришедший от контроллера выше
		this._cfg = cfgFromGameCtrl;

		// Конфиг, который передаём во вьюху
		const buttonsCallbackConfig = {
			btnCancel: {
				onClickCb: this.cancelBtnClick,
				ctx: this
			},
			btnClear: {
				onClickCb: this.clearBtnClick,
				ctx: this
			},
			btnRepeat: {
				onClickCb: this.repeatBtnClick,
				ctx: this
			},
			btnX2: {
				onClickCb: this.x2BtnClick,
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

	disableButtons(){
		this._buttonClasses.forEach((btnView)=>{
			btnView.btnDisable();
		})
	};

	cancelBtnClick(){
		if(this._cfg && this._cfg.cancelCb){
			this._cfg.cancelCb.call(this._cfg.ctx)
		} else {
			console.log('cancelBtnClick (ButtonPanelController)');
		}
	}

	clearBtnClick(){
		if(this._cfg && this._cfg.clearCb){
			this._cfg.clearCb.call(this._cfg.ctx)
		} else {
			console.log('clearBtnClick (ButtonPanelController)');
		}
	}

	repeatBtnClick(){
		if(this._cfg && this._cfg.repeatCb){
			this._cfg.repeatCb.call(this._cfg.ctx)
		} else {
			console.log('repeatBtnClick (ButtonPanelController)');
		}
	}

	x2BtnClick(){
		if(this._cfg && this._cfg.x2Cb){
			this._cfg.x2Cb.call(this._cfg.ctx)
		} else {
			console.log('x2BtnClick (ButtonPanelController)');
		}
	}
}
