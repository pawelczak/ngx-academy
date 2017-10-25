import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Logger } from '../../../src/app/util/logger';
import { FlatComponent } from './components/flat.component';
import { FirstLevelComponent } from './components/first-level.component';
import { SecondLevelComponent } from './components/second-level.component';


describe('Life cycle hooks - ', () => {


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
							provide: Logger, useValue: {
							log: () => {
							}
						}
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
			let cycles: Array<string> = [];

			class MockLogger {
				log(text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});
			TestBed.overrideTemplate(FlatComponent, `<p>Level one Component</p>`);

			const fixture = TestBed.createComponent(FlatComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(cycles).toEqual(expectedCycles);

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

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						FlatComponent
					],
					providers: [{
						provide: Logger, useValue: {
							log: () => {
							}
						}
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
			let cycles: Array<string> = [];

			class MockLogger {
				log(text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});

			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(cycles).toEqual(expectedCycles);

		})

	});

	describe('Simple Two level components tree -', () => {


		beforeEach(() => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						FirstLevelComponent,
						SecondLevelComponent
					],
					providers: [{
						provide: Logger, useValue: {
							log: () => {
							}
						}
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
			let cycles: Array<string> = [];

			class MockLogger {
				log(text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});

			const fixture = TestBed.createComponent(FirstLevelComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(cycles).toEqual(expectedCycles);

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
			let cycles: Array<string> = [];

			class MockLogger {
				log(text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});
			TestBed.overrideTemplate(FirstLevelComponent, `<ct-second-level [input]="'Text'" ></ct-second-level>`);

			const fixture = TestBed.createComponent(FirstLevelComponent);

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(cycles).toEqual(expectedCycles);

		});

	})


});