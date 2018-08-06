import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'sp-',
	template: `
		<p>Task</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit {

	constructor() {}

	ngOnInit() {}

}
