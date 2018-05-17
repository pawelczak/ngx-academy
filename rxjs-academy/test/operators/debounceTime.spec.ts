import { debounceTime } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/Rx';


describe('Rxjs - operators - debounceTime -', () => {

	let testScheduler: TestScheduler;

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should return only last value', () => {

		testScheduler.run(({ cold, expectObservable }) => {

			// given
			const givenValues = cold('-a-b-c-----|'),
				expectedValues = 	 '--------c--|';

			// when
			const actualValues = givenValues.pipe(
				debounceTime(3)
			);

			// then
			expectObservable(actualValues).toBe(expectedValues);
		});
	});

});