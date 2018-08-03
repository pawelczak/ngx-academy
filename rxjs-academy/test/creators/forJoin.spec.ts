import { cold } from 'jasmine-marbles';
import { forkJoin, interval } from 'rxjs';
import { mapTo } from 'rxjs/operators';

/**
 * When all observables complete, give the last
 * emitted value from each as an array
 */
describe('Rxjs - forJoin', () => {

	xit('should combine two observables - marble', () => {

		// given
		const inputOne = cold('-c---|');
		const inputTwo = cold('-z---|');
		const expectedValues = cold('-----(cz)|');

		// when
		const actualValues =
			forkJoin(
				inputOne,
				inputTwo
			);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});


	it('should combine two observables', (done) => {

		// given
		const sourceOne$ = interval(5).take(2).pipe(mapTo(1)),
			sourceTwo$ = interval(10).take(2).pipe(mapTo(2));

		// when
		forkJoin(
			sourceOne$,
			sourceTwo$
		)
			.subscribe((values: Array<number>) => {

					// then
					expect(values).toEqual([1, 2]);

				},
				null,
				() => {

					/**
					 * Observables should complete
					 */
					done();
				})
	})

});
