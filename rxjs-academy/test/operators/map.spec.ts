import { cold } from 'jasmine-marbles';
import { map } from 'rxjs/operators';


describe('RxJS - operators - map -', () => {

	it('should map one value to another', () => {

		// given
		const givenValues = {
				a: 1,
				b: 2,
				c: 3
			},
			expectedValues = {
				x: 2,
				y: 4,
				z: 6
			};

		const givenValues$ = cold('-a-b-c-|', givenValues);
		const expectedValues$ = cold('-x-y-z-|', expectedValues);

		// when
		const actualValues$ = givenValues$.pipe(
											map(v => v * 2)
										);

		// then
		expect(actualValues$).toBeObservable(expectedValues$);
	});

});
