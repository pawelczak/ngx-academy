import {
	AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ComponentRef, ContentChild, DoCheck, ElementRef, Host, Injector, Input,
	OnChanges, OnDestroy,
	OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef
} from "@angular/core";

import { Logger } from '../util/logger';
import { LifeCyclesComponent } from './life-cycles.component';
import { GithubApiService } from '../http/github-api.service';

@Component({
	selector: 'ct-level-one',
	template: `

		<h1>Level One {{renderInput()}}</h1>
		

		<ct-level-two >
			
			<!--<h1>Level One</h1>-->

			<!--<ng-template #template >-->
				<!--<p>Aaaa</p>-->
			<!--</ng-template>-->
			<!---->
		</ct-level-two>

		<ct-level-two [input]="input" >
		
		
		</ct-level-two>
	`
})
export class LevelOneComponent extends LifeCyclesComponent {

	@ContentChild('text', { static: true })
	text: ComponentRef<any>;


	@Input()
	input: any;

	prefix: string = 'LevelOne - ';

	constructor(private logger: Logger,
				private githubApiService: GithubApiService) {
		super();
	}

	log(text: any): void {
		this.logger.log(`${this.prefix}${text}`);
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
