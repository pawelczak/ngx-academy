import { Component, ContentChild, forwardRef } from '@angular/core';

import { ParentComponent } from './parent.component';

@Component({
	selector: 'child',
	template: ``
})
export class ChildComponent {
	@ContentChild(ParentComponent)
	compRef: ParentComponent;
}
