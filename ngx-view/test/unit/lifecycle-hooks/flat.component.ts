import { Component, Input } from '@angular/core';

import { LifeCyclesComponent } from '../../../src/app/components/life-cycles.component';
import { Logger } from '../../../src/app/util/logger';

@Component({
	selector: 'ct-flat',
	template: `		
		<p>Flat Component</p>

	`
})
export class FlatComponent extends LifeCyclesComponent {

	@Input()
	input: string;

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(text);
	}

}
