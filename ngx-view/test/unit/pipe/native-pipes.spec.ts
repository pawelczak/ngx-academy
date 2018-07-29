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
	 * - keyvalue
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
	describe('string -', () => {

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

		it('should modify template value by specific pipe', () => {

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

		describe('json -', () => {

			const givenData = {
					jaba: 'the',
					the: 'han',
					hut: 'solo'
				},
				expectedValue = JSON.stringify(givenData, null, 2);

			@Component({
				selector: 'pipes-test',
				template: `
					<p>{{object | json}}</p>
				`
			})
			class PipesTestComponent {

				object = givenData;
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

			it('should modify template value by specific pipe', () => {

				// given
				const fixture = TestBed.createComponent(PipesTestComponent);

				// when
				fixture.detectChanges();

				// then
				const elements = fixture.nativeElement.querySelectorAll('p');

				expect(elements[0].textContent).toBe(expectedValue);
			});
		});


		/**
		 * The pipe keyvalue allows to iterate over object/array/map,
		 * by "key" rather than value.
		 * Other thing that should be said is that it serves data sorted, so:
		 * {
		 * 	2: 'Cruise'
		 * 	1: 'Tom'
		 * }
		 * will be presentend in order 1: 'Tom', '2: Cruise'
		 */
		describe('keyvalue -', () => {

			const givenData = {
					1: 'Lebron',
					2: 'James'
				};

			@Component({
				template: `
					<div *ngFor="let item of object | keyvalue">
						<h1 >{{item.key}}</h1>
						<h2 >{{item.value}}</h2>
					</div>
				`
			})
			class KeyValuePipeComponent {

				object = givenData;
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							KeyValuePipeComponent
						]
					});
			});

			it('should modify template value by specific pipe', () => {

				// given
				const fixture = TestBed.createComponent(KeyValuePipeComponent);

				// when
				fixture.detectChanges();

				// then
				const keys = fixture.nativeElement.querySelectorAll('h1'),
					values = fixture.nativeElement.querySelectorAll('h2');

				Object.keys(givenData)
					.forEach((key, index) => {
						expect(keys[index].innerText).toBe(key);
						expect(values[index].innerText).toBe(givenData[key]);
					})
			});

		});
	});

	describe('Number -', () => {

	});

	describe('Array & string -', () => {

	});

});
