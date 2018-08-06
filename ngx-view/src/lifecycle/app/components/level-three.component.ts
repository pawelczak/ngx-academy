import { Component, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'ct-level-three',
	template: `

		<ng-container [ngTemplateOutlet]="template"></ng-container>
	`
})
export class LevelThreeComponent {

	@Input()
	template: TemplateRef<any>;

}