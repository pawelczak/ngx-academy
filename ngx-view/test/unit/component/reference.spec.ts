import { Component, Host } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component - reference -', () => {

	describe('injector -', () => {

		it ('should not be added to injector', () => {

			@Component({
				selector: 'child',
				template: ``
			})
			class ChildComponent {
				constructor(public testComponent: TestComponent) {}
			}

			@Component({
				selector: 'test',
				template: `<child></child>`
			})
			class TestComponent {}

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						ChildComponent
					]
				});

			// when & then
			expect(() => TestBed.createComponent(TestComponent)).toThrowError();
		});
	});
});
