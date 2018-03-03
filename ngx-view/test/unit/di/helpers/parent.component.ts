import { Component, ContentChild } from '@angular/core';

import { ChildComponent } from './child.component';

@Component({
	selector: 'parent',
	template: ``
})
export class ParentComponent {
	@ContentChild(ChildComponent)
	compRef: ChildComponent;
}
