import { TestBed } from '@angular/core/testing';

import { LevelOneComponent } from '../../src/app/components/level-one.component';
import { Logger } from '../../src/app/util/logger';
import { Component } from '@angular/core';


describe('View test', () => {


	describe('Life cycle hooks - One level of component', () => {


		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						LevelOneComponent
					],
					providers: [
						{provide: Logger, useValue: {log: () => {}}}
					]
				});
		});

		it ('should invoke lifecycle hooks - without OnChanges', () => {

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
				log (text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});
			TestBed.overrideTemplate(LevelOneComponent, `<p>Level one Component</p>`);

			const fixture = TestBed.createComponent(LevelOneComponent);

			fixture.componentInstance.prefix = '';

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
	describe ('Component with input should invoke all lifecycle hooks -', () => {

		@Component({
			selector: 'test',
			template: `<ct-level-one [input]="'value'" ></ct-level-one>`
		})
		class TestComponent {}


		beforeEach(() => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						LevelOneComponent
					],
					providers: [{
						provide: Logger, useValue: {log: () => {}}
					}]
				});

		});

		it ('should fire OnChanges', () => {

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
				log (text: string): void {
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


	})





});