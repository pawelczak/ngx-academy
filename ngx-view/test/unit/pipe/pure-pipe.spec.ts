import { Component, Injectable, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Pure pipes -', () => {

	@Injectable()
	class Logger {
		logs = {};

		private PURE = 'PURE';
		private IMPURE = 'IMPURE';

		constructor() {
			this.clear();
		}

		pureNumberOfLogs() {
			return this.logs[this.PURE].length;
		}
		impureNumberOfLogs() {
			return this.logs[this.IMPURE].length;
		}
		logPure(text: string = '') {
			this.logs[this.PURE].push(text);
		}
		logImpure(text: string = '') {
			this.logs[this.IMPURE].push(text);
		}
		clear() {
			this.logs = {};
			this.logs[this.PURE] = [];
			this.logs[this.IMPURE] = [];
		}
	}

	/**
	 * Pure:
	 * - input parameters value determine the output so if input parameters don’t change the output doesn’t change
	 * - can be shared across many usages without affecting the output result
	 * - need to be used on immutable data
	 */
	@Pipe({
		name: 'purePipe',
		pure: true
	})
	class PurePipe implements PipeTransform {
		constructor(private logger: Logger) {}

		transform(value: any, ...args: any[]): any {
			this.logger.logPure();
			return value + 1;
		}
	}

	/**
	 * Impure:
	 * - cannot use the input value to determine if the output will change
	 * - cannot be shared because the internal state can be affected from outside
	 * - can be used on mutable data
	 */
	@Pipe({
		name: 'impurePipe',
		pure: false
	})
	class ImpurePipe implements PipeTransform {
		constructor(private logger: Logger) {}

		transform(value: any, ...args: any[]): any {
			this.logger.logImpure();
			return value + 1;
		}
	}

	@Component({
		selector: 'test',
		template: `
		
			<p>{{value | purePipe}}</p>
			
			<p>{{value | impurePipe}}</p>
		`
	})
	class TestComponent {
		value = 0;
	}


	beforeEach(() => {
		TestBed
			.configureTestingModule({
				providers: [
					Logger
				],
				declarations: [
					PurePipe,
					ImpurePipe,
					TestComponent
				]
			});
	});

	/**
	 * Pure pipes are invoked only when the reference to a values changes.
	 *
	 * Impure pipes are invoked every time change detection cycle is executed.
	 */
	it ('should transform values', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent);
		const logger = TestBed.get(Logger);

		// when
		fixture.detectChanges();
		fixture.detectChanges();
		fixture.detectChanges();
		fixture.detectChanges();
		fixture.detectChanges();

		// then
		const elements = fixture.nativeElement.querySelectorAll('p');

		expect(elements[0].textContent).toEqual('1');
		expect(elements[1].textContent).toEqual('1');

		expect(logger.pureNumberOfLogs()).toEqual(1);
		/**
		 * Fixture#detectChanges runs change detection twice, than compares templates
		 * and throws errors if they don't match.
		 * That is way number of impure logs is 10, although Fixture#detectChanges was invoked
		 * only 5 times.
		 */
		expect(logger.impureNumberOfLogs()).toEqual(10);

	});

});
