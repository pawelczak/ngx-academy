// 3d party imports
import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';

import { Logger } from './util/logger';


@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.ngx.scss'
	],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

	input = 0;

	private prefix: string = '🐯 Root Level';

	constructor(private logger: Logger) {

	}

	changeInput(): void {
		this.input++;
	}

	renderInput(): string {
		this.logger.log(`${this.prefix} - render input`);
		return `${this.prefix} - ${this.input}`;
	}
}
