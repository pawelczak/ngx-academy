import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Logger } from '../../../src/app/util/logger';
import { FlatComponent } from './components/flat.component';
import { FirstLevelComponent } from './components/first-level.component';
import { SecondLevelComponent } from './components/second-level.component';


describe('Life cycle hooks - ', () => {



	class MockLogger {

		private cycles: Array<string> = [];

		log(text: string): void {
			this.cycles.push(text);
		}

		print(): Array<string> {
			return this.cycles;
		}

		clear(): void {
			this.cycles = [];
		}
	}

	let mockLogger = new MockLogger();

	describe('Flat, one level component', () => {

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						FlatComponent
					],
					providers: [
						{
							provide: Logger, useValue: mockLogger
						}
					]
				});
		});

		it('should invoke lifecycle hooks - without OnChanges', () => {

			// given
			const expectedCycles = [
				'ngOnInit',
				'ngDoCheck',
				'ngAfterContentInit',
				'ngAfterContentChecked',
				'ngAfterViewInit',
				'ngAfterViewChecked',
				'ngOnDestroy'
			];
			TestBed.overrideTemplate(FlatComponent, `<p>Level one Component</p>`);

			const fixture = TestBed.createComponent(FlatComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(mockLogger.print()).toEqual(expectedCycles);

		});

	});

	/**
	 * OnChanges Lifecycle Hook is invoked only when component has "input" and that property has a value.
	 */
	describe('Component with input should invoke all lifecycle hooks -', () => {

		@Component({
			selector: 'test',
			template: `
				<ct-flat [input]="'value'"></ct-flat>`
		})
		class TestComponent {
		}


		beforeEach(() => {
			mockLogger.clear();

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						FlatComponent
					],
					providers: [{
						provide: Logger, useValue: mockLogger
					}]
				});

		});

		it('should fire OnChanges', () => {

			// given
			const expectedCycles = [
				'ngOnChanges',
				'ngOnInit',
				'ngDoCheck',
				'ngAfterContentInit',
				'ngAfterContentChecked',
				'ngAfterViewInit',
				'ngAfterViewChecked',
				'ngOnDestroy'
			];
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(mockLogger.print()).toEqual(expectedCycles);

		})

	});

	describe('Simple Two level components tree -', () => {


		beforeEach(() => {
			mockLogger.clear();

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						FirstLevelComponent,
						SecondLevelComponent
					],
					providers: [{
						provide: Logger, useValue: mockLogger
					}]
				});

		});

		/**
		 *
		 * <ct-first-level>
		 *     <ct-second-level></<ct-second-level>
		 * </ct-first-level>
		 *
		 */
		it('components does not have content', () => {

			// given
			const expectedCycles = [
				'First level - ngOnInit',
				'First level - ngDoCheck',
				'First level - ngAfterContentInit',
				'First level - ngAfterContentChecked',
				'Second level - ngOnInit',
				'Second level - ngDoCheck',
				'Second level - ngAfterContentInit',
				'Second level - ngAfterContentChecked',
				'Second level - ngAfterViewInit',
				'Second level - ngAfterViewChecked',
				'First level - ngAfterViewInit',
				'First level - ngAfterViewChecked',
				'Second level - ngOnDestroy',
				'First level - ngOnDestroy'
			];
			const fixture = TestBed.createComponent(FirstLevelComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(mockLogger.print()).toEqual(expectedCycles);

		});

		it('Second level component has input', () => {

			// given
			const expectedCycles = [
				'First level - ngOnInit',
				'First level - ngDoCheck',
				'First level - ngAfterContentInit',
				'First level - ngAfterContentChecked',
				'Second level - ngOnChanges',
				'Second level - ngOnInit',
				'Second level - ngDoCheck',
				'Second level - ngAfterContentInit',
				'Second level - ngAfterContentChecked',
				'Second level - ngAfterViewInit',
				'Second level - ngAfterViewChecked',
				'First level - ngAfterViewInit',
				'First level - ngAfterViewChecked',
				'Second level - ngOnDestroy',
				'First level - ngOnDestroy'
			];

			TestBed.overrideTemplate(FirstLevelComponent, `<ct-second-level [input]="'Text'" ></ct-second-level>`);

			const fixture = TestBed.createComponent(FirstLevelComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(mockLogger.print()).toEqual(expectedCycles);

		});

	});

	describe('input modifications', () => {

		@Component({
			selector: 'test',
			template: `<ct-first-level [input]="val" ></ct-first-level>`
		})
		class InputTestComponent {

			val = 8;

			changeVal() {
				this.val = 10;
			}
		}

		beforeEach(() => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InputTestComponent,
						FirstLevelComponent
					],
					providers: [{
						provide: Logger, useValue: mockLogger
					}]
				});

		});

		it('Change input value of a component', () => {

			// given
			const expectedCycles = [
				'First level - ngOnChanges',
				'First level - ngDoCheck',
				'First level - ngAfterContentChecked',
				'First level - ngAfterViewChecked'
			];

			TestBed.overrideTemplate(FirstLevelComponent, `no content`);
			const fixture = TestBed.createComponent(InputTestComponent);

			// when
			fixture.detectChanges();
			mockLogger.clear();
			fixture.componentInstance.changeVal();
			fixture.detectChanges();

			// then
			expect(mockLogger.print()).toEqual(expectedCycles);
		});

	});

});
