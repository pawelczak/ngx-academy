import {
	AfterContentChecked,
	AfterContentInit,
	AfterViewChecked,
	AfterViewInit, Component,
	DoCheck,
	OnChanges,
	OnDestroy,
	OnInit,
	Pipe,
	PipeTransform, SimpleChanges
} from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Pipe - lifecycle hooks -', () => {

	class Logger {
		private logs: Array<string> = [];

		log(log: string): void {
			this.logs.push(log);
		}

		print(): Array<string> {
			return this.logs;
		}

		clear(): void {
			this.logs.length = 0;
		}
	}

	@Pipe({
		name: 'lchPipe',
		pure: true
	})
	class LchPipe implements PipeTransform, OnChanges, OnInit, DoCheck,
							  AfterContentInit, AfterContentChecked, AfterViewInit,
							  AfterViewChecked, OnDestroy {
		constructor(private logger: Logger) {}

		transform(value: any, ...args: any[]): any {
			return value + '...';
		}

		ngOnChanges(changes: SimpleChanges): void {
			this.logger.log('ngOnChanges');
		}

		ngOnInit(): void {
			this.logger.log('ngOnInit');
		}

		ngDoCheck(): void {
			this.logger.log('ngDoCheck');
		}

		ngAfterContentInit(): void {
			this.logger.log('ngAfterContentInit');
		}

		ngAfterContentChecked(): void {
			this.logger.log('ngAfterContentChecked');
		}

		ngAfterViewInit(): void {
			this.logger.log('ngAfterViewInit');
		}

		ngAfterViewChecked(): void {
			this.logger.log('ngAfterViewChecked');
		}

		ngOnDestroy(): void {
			this.logger.log('ngOnDestroy');
		}
	}

	@Component({
		template: `
			<ng-container #pipe>
				{{ 'wow' | lchPipe }}
			</ng-container>
		`,
		providers: [
			Logger
		]
	})
	class TestComponent {
		constructor(public logger: Logger) {}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				LchPipe
			]
		})
	});

	it ('should have ngOnDestroy lifecycle hook', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent),
			compInstance = fixture.componentInstance,
			expectedLogs = [
				'ngOnDestroy'
			];

		// when
		fixture.detectChanges();
		fixture.destroy();

		// then
		const logs = compInstance.logger.print();

		expect(logs).toEqual(expectedLogs)
	});
});
