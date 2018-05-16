import { cold, getTestScheduler } from 'jasmine-marbles';
import { delay } from 'rxjs/operators';


describe('RxJS - operators - delay -', () => {

	let givenValues: any,
		expectedValues: any;

	beforeEach(() => {
		givenValues = {
			a: 1,
			b: 2,
			c: 3
		};
		expectedValues = {...givenValues};
	});

	/**
	 * delay(numberOfFrames, testScheduler)
	 * passing testScheduler to the delay operators
	 * makes one time frame '-' to be 10ms
	 */
	it('should delay by one frame - 10 ms', () => {

		// given
		const givenValues$ = cold('a|', givenValues);
		const expectedValues$ = cold('-a|', expectedValues);

		const scheduler = getTestScheduler();

		// when
		const actualValues$ = givenValues$.pipe(
			delay(10, scheduler)
		);

		// then
		expect(actualValues$).toBeObservable(expectedValues$);
	});

	it('should delay multiple values by 5 time frames', () => {


	});

});
