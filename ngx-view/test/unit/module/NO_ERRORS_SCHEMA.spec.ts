import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('NO_ERRORS_SCHEMA -', () => {

	@Component({
		selector: 'complex',
		template: ``
	})
	class ComplexComponent {}

	@Component({
		template: `
			<complex [unknownInput]="true" ></complex>
		`
	})
	class TestComponent {}


	/**
	 * It isn't possible to create component with not specified input.
	 */
	it ('should not be possible to create component with not declared inputs', () => {

		// given
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					TestComponent,
					ComplexComponent
				]
			});

		// when & then
		expect(() => TestBed.createComponent(TestComponent)).toThrowError();
	});

	/**
	 * Setting NO_ERRORS_SCHEMA allows to create component, despite having unknown input.
	 */
	it ('should allow to create component', () => {

		// given
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					TestComponent,
					ComplexComponent
				],
				schemas: [
					NO_ERRORS_SCHEMA
				]
			});

		// when & then
		expect(() => TestBed.createComponent(TestComponent)).not.toThrowError();
	});

});
