import { Component, Input } from '@angular/core';

import { LifeCyclesComponent } from '../../../../src/lifecycle/app/components/life-cycles.component';
import { Logger } from '../../../../src/lifecycle/app/util/logger';

@Component({
	selector: 'ct-second-level',
	template: `

	`
})
export class SecondLevelComponent extends LifeCyclesComponent {

	@Input()
	input: string;

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(`Second level - ${text}`);
	}

}
