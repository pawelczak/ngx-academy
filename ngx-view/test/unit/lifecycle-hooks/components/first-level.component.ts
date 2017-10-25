import { Component } from '@angular/core';

import { LifeCyclesComponent } from '../../../../src/app/components/life-cycles.component';
import { Logger } from '../../../../src/app/util/logger';

@Component({
	selector: 'ct-first-level',
	template: `
		<ct-second-level></ct-second-level>
	`
})
export class FirstLevelComponent extends LifeCyclesComponent {

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(`First level - ${text}`);
	}

}
