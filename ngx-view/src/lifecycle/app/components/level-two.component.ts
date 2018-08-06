import { Component, ContentChild, Input, TemplateRef, ViewChild } from "@angular/core";

import { LifeCyclesComponent } from './life-cycles.component';
import { Logger } from '../util/logger';

@Component({
	selector: 'ct-level-two',
	template: `

		<!--<ct-separator></ct-separator>-->
		<p>Nice</p>
		
		<!--<h2>Level Two {{renderInput()}}</h2>-->

		<!--<ng-container [ngTemplateOutlet]="template"></ng-container>-->

		<!--<ct-level-three [template]="template"></ct-level-three>-->
	`
})
export class LevelTwoComponent extends LifeCyclesComponent {


	@ContentChild('template')
	template: TemplateRef<any>;

	@Input()
	input: any;

	private prefix: string = 'LevelTwo';

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(`${this.prefix} - ${text}`);
	}

	renderInput(): string {
		this.logger.log(`${this.prefix} - render input`);
		return this.input;
	}

}
