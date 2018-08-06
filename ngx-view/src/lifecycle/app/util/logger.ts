import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

	log(text: any) {
		console.log(text);
	}

}
