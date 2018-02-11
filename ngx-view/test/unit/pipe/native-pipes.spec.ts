import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Natives pipes -', () => {

	/**
	 * There are couple of native pipes in Angular framework:
	 *
	 * String modifiers:
	 * - lowercase
	 * - uppercase
	 * - titlecase
	 *
	 * Date:
	 * - date
	 *
	 * Object:
	 * - json
	 *
	 * Number:
	 * - number
	 * - percent
	 * - currency
	 *
	 * Array & string:
	 * - slice
	 *
	 */
	describe ('string -', () => {

		@Component({
			selector: 'pipes-test',
			template: `
			
			<p>{{text | lowercase}}</p>
			
			<p>{{text | uppercase}}</p>
			
			<p>{{text | titlecase}}</p>
			
			`
		})
		class PipesTestComponent {

			text = 'han Solo';
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						PipesTestComponent
					]
				});
		});

		it ('should modify template value by specific pipe', () => {

			// given
			const fixture = TestBed.createComponent(PipesTestComponent);

			// when
			fixture.detectChanges();

			// then
			const elements = fixture.nativeElement.querySelectorAll('p');

			expect(elements[0].textContent).toBe('han solo');
			expect(elements[1].textContent).toBe('HAN SOLO');
			expect(elements[2].textContent).toBe('Han Solo');
		});

	});

	describe('Date -', () => {


	});

	describe('Object -', () => {

		@Component({
			selector: 'pipes-test',
			template: `
				<p>{{object | json}}</p>
			`
		})
		class PipesTestComponent {

			object = {
				jaba: 0,
				the: 1,
				hut: 2
			};
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						PipesTestComponent
					]
				});
		});

		it ('should modify template value by specific pipe', () => {

			// given
			const fixture = TestBed.createComponent(PipesTestComponent),
				expectedValue = JSON.stringify(fixture.componentInstance.object, null, 2);
			/**
			 * expectedValue
			 * '{
				  "jaba": 0,
				  "the": 1,
				  "hut": 2
				}'
			 */

			// when
			fixture.detectChanges();

			// then
			const elements = fixture.nativeElement.querySelectorAll('p');

			expect(elements[0].textContent).toBe(expectedValue);
		});
	});

	describe('Number -', () => {

	});

	describe('Array & string -', () => {

	});

});
