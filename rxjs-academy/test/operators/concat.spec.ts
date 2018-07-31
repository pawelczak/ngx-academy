import { cold } from 'jasmine-marbles';
import { concat } from 'rxjs';


describe('RxJs - operators - concat -', () => {

	it ('should concat two observables', () => {

		// given
		const inputOne =	 	cold('-a---b---c--|');
		const inputTwo = 		cold('---x--y--|');
		const expectedValues = 	cold('-a---b---c-----x--y--|');

		// when
		const actualValues = concat(
			inputOne,
			inputTwo
		);

		// then
		expect(actualValues).toBeObservable(expectedValues);
	});

});
