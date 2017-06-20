import View from './view';
import errors from './errors'

export default class Controller {

	constructor(config) {
		this.view = new View(config);
	}

	viewError(code, lockError){
		let error = errors.find((item) => {
			return item.error_code === code;
		});

		this.view.viewError(error.ru, lockError);
	}

}