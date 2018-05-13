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

	let subscriberTester: SubscriberTester;

	beforeEach(() => {
		subscriberTester = new SubscriberTester();
	});

	it('should by default return all values', (done) => {

		// given
		let subject = new ReplaySubject<string>();
		subject.next(givenValueOne);
		subject.next(givenValueTwo);
		subject.next(givenValueThree);

		// when
		subject.subscribe((value: string) => {

			// then
			subscriberTester.assertValue(value, givenValues);
			done();
		});
	});

	it('should return n values', (done) => {

		// given
		let subject = new ReplaySubject<string>(2);
		subject.next(givenValueThree);
		subject.next(givenValueOne);
		subject.next(givenValueTwo);


		// when
		subject.subscribe((value: string) => {

			// then
			subscriberTester.assertValue(value, givenValues);
			done();
		});
	});

	class SubscriberTester {

		private counter = 0;

		assertValue(value: string, expectedValues: Array<string>) {
			expect(value).toEqual(expectedValues[this.counter]);
			this.counter += 1;
		}
	}
});
