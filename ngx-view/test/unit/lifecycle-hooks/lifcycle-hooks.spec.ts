import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Logger } from '../../../src/app/util/logger';
import { FlatComponent } from './flat.component';


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
	describe ('Component with input should invoke all lifecycle hooks -', () => {

		@Component({
			selector: 'test',
			template: `<ct-flat [input]="'value'" ></ct-flat>`
		})
		class TestComponent {}


		beforeEach(() => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						FlatComponent
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