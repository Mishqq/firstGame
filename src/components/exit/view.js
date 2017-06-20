import {spriteStore} from './../../constants/presets';
import settings from './settings';
import {Sprite, Container} from "pixi.js"

export default class View {

    constructor({exit}) {

        this.exit = exit;
        let container = this.container = new Container();
        container.interactive = true;

        container.on("touchend", exit);
        container.on("mouseup", exit);

        let exitBtn = new Sprite( spriteStore.buttons2.btnExit );
        exitBtn.position = {x: 20, y: 15};
        let bgBtn = new Sprite( spriteStore.buttons2.bgExit );

        container.position = settings.position;

        container.addChild( bgBtn );
        container.addChild( exitBtn );

    }

}