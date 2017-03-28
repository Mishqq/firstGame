import {_p, _pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {defaultPositions} from './../../constants/defaultPositions';

// views
import limitsPanel from './limitsView'
import hotNumPanel from './hotNumbersView'
import coldNumPanel from './coldNumbersView'
import otherNumPanel from './otherNumbersView'

export default class infoPanelView {
	constructor(dataFromController) {
		// Контейнер для фишки с тенью и текстом
		let spriteContainer = new _pxC();
		this._spriteContainer = spriteContainer;

		spriteContainer.x = defaultPositions.infoPanel.main.x;
		spriteContainer.y = defaultPositions.infoPanel.main.y;

		let bg = new _pxS.fromImage('./assets/images/bg_info.png');

		spriteContainer.addChild(bg);
		for(let i=1; i<=3; i+=1){
			let sep = new _pxS.fromImage('./assets/images/separator_vert.png');
			sep.position = {x: i*337, y: 0};
			spriteContainer.addChild( sep );
		}

		this.panels = {
			limitsPanel: new limitsPanel( dataFromController.limitsPanel ),

			hotNumPanel: new hotNumPanel( dataFromController.hotNumPanel ),

			coldNumPanel: new coldNumPanel( dataFromController.coldNumPanel ),

			otherNumPanel: new otherNumPanel( dataFromController.otherNumPanel )
		};

		// Позиция каждой панели
		for(let panel in this.panels)
			this.panels[panel].sprite.position = defaultPositions.infoPanel[panel]

		for(let key in this.panels)
			spriteContainer.addChild( this.panels[key].sprite );
	}

	get sprite(){
		return this._spriteContainer;
	}

	update(data){
		// TODO: добавить метод updateLimits для лимитов
		for(let panel in data){
			this.panels[panel].updateView( data[panel] );
		}
	}
}
