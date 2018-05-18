import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

describe('RxJs - operators - merge -', () => {


	it ('should merge two observables', () => {

		// given
		const inputOne =	 	cold('-a---b---c--|');
		const inputTwo = 		cold('---x----y---|');
		const expectedValues = 	cold('-a-x-b--yc--|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

	it ('should merge two observables that complete on different frames', () => {

		// given
		const inputOne =	 	cold('------a-----|');
		const inputTwo = 		cold('-x--|');
		const expectedValues = 	cold('-x----a-----|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

	it ('should merge two observables that emit value on the same frame', () => {

		// given
		const inputOne =		cold('---a---|');
		const inputTwo = 		cold('---b---|');
		const expectedValues = 	cold('---(ab)|');

		// when
		const actualValues = inputOne.pipe(
			merge(inputTwo)
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});
});
