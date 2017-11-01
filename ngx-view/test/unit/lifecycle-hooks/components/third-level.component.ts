import { Component, Input } from '@angular/core';

import { LifeCyclesComponent } from '../../../../src/app/components/life-cycles.component';
import { Logger } from '../../../../src/app/util/logger';

@Component({
	selector: 'ct-third-level',
	template: `

	`
})
export class ThirdLevelComponent extends LifeCyclesComponent {

	@Input()
	input: string;

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(`Third level - ${text}`);
	}

}
