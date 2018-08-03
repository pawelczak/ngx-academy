import { cold } from 'jasmine-marbles';
import { concat, interval } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';


describe('RxJs - operators - concat -', () => {

	it('should concat two observables', () => {

		// given
		const inputOne = cold('-a---b---c--|');
		const inputTwo = cold('---x--y--|');
		const expectedValues = cold('-a---b---c-----x--y--|');

		// when
		const actualValues = concat(
			inputOne,
			inputTwo
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

	/**
	 * Concat combines observables.
	 * In the example below when there are two observables combined with concat operator,
	 * the first one will be started right a way and the second one will be started
	 * when the first one completes.
	 *
	 * It's bad aproach when you want to use it for http calls because you cannot know
	 * from which source data will appear first.
	 */
	it('should concat two observables created with create functions', (done) => {

		// given
		const givenValues = [
			5,
			12
		];

		const sourceOne$ = interval(1).pipe(take(1), mapTo(givenValues[0])),
			sourceTwo$ = interval(3).pipe(take(1), mapTo(givenValues[1]));

		// when
		let iterator = 0;

		concat(
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
