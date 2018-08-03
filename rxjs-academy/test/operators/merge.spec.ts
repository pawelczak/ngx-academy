import { cold } from 'jasmine-marbles';
import { merge as mergeCreator, interval } from 'rxjs/index';
import { mapTo, merge, take } from 'rxjs/operators';


describe('RxJs - operators - merge -', () => {

	it('should merge two observables', () => {

		// given
		const inputOne = cold('-a---b---c--|');
		const inputTwo = cold('---x----y---|');
		const expectedValues = cold('-a-x-b--yc--|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

	it('should merge two observables that complete on different frames', () => {

		// given
		const inputOne = cold('------a-----|');
		const inputTwo = cold('-x--|');
		const expectedValues = cold('-x----a-----|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

	it('should merge two observables that emit value on the same frame', () => {

		// given
		const inputOne = cold('---a---|');
		const inputTwo = cold('---b---|');
		const expectedValues = cold('---(ab)|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});


	/**
	 * Merge combines observables:
	 * Both observables are started when users subscribes to the source
	 * merged stream completes when the last observable completes.
	 */
	it('should merge two observables created with create functions', (done) => {

		// given
		const givenValues = [
			5,
			12
		];

		const sourceOne$ = interval(1).pipe(take(1), mapTo(givenValues[0])),
			sourceTwo$ = interval(3).pipe(take(1), mapTo(givenValues[1]));

		// when
		let iterator = 0;

		mergeCreator(
			sourceOne$,
			sourceTwo$
		).subscribe((value: number) => {

				// then
				expect(value).toEqual(givenValues[iterator]);
				iterator++;
			},
			null,
			() => {
				done();
			}
		);

	});
});
