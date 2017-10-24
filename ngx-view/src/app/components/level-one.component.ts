import {
	AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ComponentRef, ContentChild, DoCheck, ElementRef, Host, Injector, Input,
	OnChanges, OnDestroy,
	OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef
} from "@angular/core";

import { Logger } from '../util/logger';
import { LifeCyclesComponent } from './life-cycles.component';

@Component({
	selector: 'ct-level-one',
	template: `

		<!--<h1>Level One {{renderInput()}}</h1>-->
		<h1>Level One</h1>

		<!--<ct-level-two [input]="input" >-->
		<!---->
		<!--<ng-template #template >-->
		<!--<div>Template {{renderTemplateInput()}}</div>-->
		<!--</ng-template>-->
		<!--</ct-level-two>-->
	`
})
export class LevelOneComponent extends LifeCyclesComponent {

	@ContentChild('text')
	text: ComponentRef<any>;


	@Input()
	input: any;

	prefix: string = '🍕 LevelOne - ';

	constructor(private logger: Logger) {
		super();
	}

	log(text: any): void {
		this.logger.log(text);
	}

	renderInput(): string {
		this.logger.log(`${this.prefix} - render input`);
		return this.input;
	}

	renderTemplateInput(): string {
		this.logger.log(`🐯 ngTemplate - render input`);
		return this.input;
	}
}
