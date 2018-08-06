import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-project',
	template: `
		<p>Projects</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit {

	constructor() {}

	ngOnInit() {}

}
