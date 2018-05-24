import { ReplaySubject } from 'rxjs';

import { SubjectTester } from './helpers/SubjectTester';

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

	let subjectTester: SubjectTester;

	beforeEach(() => {
		subjectTester = new SubjectTester();
	});

	/**
	 * By default Replay subject returns all the values.
	 */
	it('should by default return all values', (done) => {

		// given
		let expectedValues = [...givenValues];

		let subject = new ReplaySubject<string>();
		subject.next(givenValueOne);
		subject.next(givenValueTwo);
		subject.next(givenValueThree);

		// then
		subject.subscribe((value: string) => {

				subjectTester.assertValue(value, expectedValues);
			},
			() => {
			},
			() => {
				subjectTester.assertNumberOfAssertions(expectedValues.length);
				done();
			});

		// when
		subject.complete();
	});

	/**
	 * It's possible to specify exact number of values, that ReplaySubject
	 * emits on subscription.
	 */
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
				subjectTester.assertValue(value, givenValues);
			}, () => {
			},
			() => {
				subjectTester.assertNumberOfAssertions(cacheSize);
				done();
			});

		// when
		subject.complete();
	});
});
