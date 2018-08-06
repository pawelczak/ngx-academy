import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-another',
	templateUrl: `
		Another app
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnotherAppComponent implements OnInit {

	constructor() {

	}

	ngOnInit() {

	}


}
