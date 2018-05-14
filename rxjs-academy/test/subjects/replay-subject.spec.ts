import { ReplaySubject } from 'rxjs';

/**
 * Replay subject return n last values when observer subscribes to it.
 */
describe('ReplaySubject -', () => {

	const givenValueOne = 'Stephen Curry',
		givenValueTwo = 'Klay Thompson',
		givenValueThree = 'Kevin Durant',
		givenValues = [
			givenValueOne,
			givenValueTwo,
			givenValueThree
		];

	let subscriberTester: SubjectTester;

	beforeEach(() => {
		subscriberTester = new SubjectTester();
	});

	it('should by default return all values', (done) => {

		// given
		let subject = new ReplaySubject<string>();
		subject.next(givenValueOne);
		subject.next(givenValueTwo);
		subject.next(givenValueThree);

		// then
		subject.subscribe((value: string) => {

				subscriberTester.assertValue(value, givenValues);
			},
			() => {
			},
			() => {
				subscriberTester.assertNumberOfAssertions(3);
				done();
			});

		// when
		subject.complete();
	});

	it('should return n values', (done) => {

		// given
		const cacheSize = 2;
		let subject = new ReplaySubject<string>(cacheSize);
		subject.next(givenValueThree);
		subject.next(givenValueOne);
		subject.next(givenValueTwo);

		// then
		subject.subscribe((value: string) => {

				// when
				subscriberTester.assertValue(value, givenValues);
			}, () => {
			},
			() => {
				subscriberTester.assertNumberOfAssertions(cacheSize);
				done();
			});

		// when
		subject.complete();
	});

	class SubjectTester {

		private counter = 0;

		assertValue(value: string, expectedValues: Array<string>): void {
			expect(value).toEqual(expectedValues[this.counter]);
			this.counter += 1;
		}

		assertNumberOfAssertions(assertionNumber: number): void {
			expect(assertionNumber).toEqual(this.counter, 'Number of assertions');
		}
	}
});
