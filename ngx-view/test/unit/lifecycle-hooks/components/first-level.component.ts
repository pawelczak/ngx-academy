import { Component, Input } from '@angular/core';

import { LifeCyclesComponent } from '../../../../src/lifecycle/app/components/life-cycles.component';
import { Logger } from '../../../../src/lifecycle/app/util/logger';

@Component({
	selector: 'ct-first-level',
	template: `
		<ct-second-level></ct-second-level>
	`
})
export class FirstLevelComponent extends LifeCyclesComponent {

	@Input()
	input: string;

	text = '9';

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(`First level - ${text}`);
	}

}
