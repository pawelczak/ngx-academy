import { cold } from 'jasmine-marbles';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';

describe('RxJs - operators - debounce -', () => {


	xit ('should filter values that haven\'t changed', () => {

		const givenValues = 	cold('-a--a--a--b--|');
		const expectedValues = 	cold('----------b--|');

		const actualValues = givenValues.pipe(
			debounce(v => timer(1))
		);

		expect(actualValues).toBeObservable(expectedValues);

	});


});
