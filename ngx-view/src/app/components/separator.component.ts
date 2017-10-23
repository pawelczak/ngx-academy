import { Component } from '@angular/core';

import { Logger } from '../util/logger';

@Component({
	selector: 'ct-separator',
	template: `

		{{renderTemplate()}}
	`
})
export class SeparatorComponent {


	constructor(private logger: Logger) {
	}

	log(text: string): void {
		this.logger.log(text);
	}

	renderTemplate(): void {
		this.log('🐋 separator - render input');
	}
}