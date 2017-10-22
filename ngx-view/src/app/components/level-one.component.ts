import {
    AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ContentChild, DoCheck, ElementRef, Injector, Input, OnChanges, OnDestroy,
    OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef
} from "@angular/core";

import { Logger } from '../util/logger';
import { LifeCyclesComponent } from './life-cycles.component';

@Component({
    selector: 'ct-level-one',
    template: `
        
        <h1>Level One {{renderInput()}}</h1>
        <!--<h1>Level One</h1>-->
        
		<!--<ct-level-two [input]="input" >-->
            <!---->
			<!--<ng-template #template >-->
				<!--<div>Template {{renderTemplateInput()}}</div>-->
			<!--</ng-template>-->
		<!--</ct-level-two>-->
    `
})
export class LevelOneComponent extends LifeCyclesComponent {

    @Input()
    input: any;

    private prefix: string = '🍕 LevelOne';

    constructor() {
        super();
    }

    log(text: any): void {
        Logger.log(`${this.prefix} - ${text}`);
    }

    renderInput(): string {
        Logger.log(`${this.prefix} - render input`);
        return this.input;
    }

    renderTemplateInput(): string {
        Logger.log(`🐯 ngTemplate - render input`);
        return this.input;
    }
}
