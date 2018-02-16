import { ChangeDetectionStrategy, Component, Injector, NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.ngx.scss'
	]
})
export class AppComponent {

	data: Array<any>;

	activeMeasure: any = false;
	startTime: any;

	constructor(private changeDetectorRef: ChangeDetectorRef) {}

	populate() {
		let data = [];
		for (let i = 0; i < 1000; i++) {
			data.push(i);
		}

		this.start();
		this.data = data;
		// this.changeDetectorRef.detectChanges();

	}

	clear() {
		this.start();
		this.data = [];
	}

	ngAfterViewChecked() {
		this.stop();
	}

	private start() {
		this.activeMeasure = true;
		this.startTime = performance.now();
	}

	private stop() {
		if (this.activeMeasure) {
			setTimeout(() => {
				this.activeMeasure = false;
				console.log('render:', performance.now() - this.startTime);
			});
		}
	}

}
