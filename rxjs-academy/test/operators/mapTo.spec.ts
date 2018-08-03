import { cold } from 'jasmine-marbles';
import { mapTo } from 'rxjs/operators';


describe('RxJS - operators - mapTo -', () => {

	it('should map one value to specific one', () => {

		// given
		const givenValues = {
				a: 1,
				b: 2,
				c: 3
			},
			expectedValues = {
				x: 3,
				y: 3,
				z: 3
			};

		const givenValues$ = cold('-a-b-c-|', givenValues);
		const expectedValues$ = cold('-x-y-z-|', expectedValues);

		// when
		const actualValues$ = givenValues$.pipe(
			mapTo(3)
		);

		// then
		expect(actualValues$).toBeObservable(expectedValues$);
	});

});