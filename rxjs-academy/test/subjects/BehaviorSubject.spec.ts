import { BehaviorSubject } from 'rxjs';

import { SubjectTester } from './helpers/SubjectTester';

/**
 * BehaviorSubject has a default value.
 */
describe('BehaviorSubject -', () => {

	const givenValueOne = 'Lebron James',
		givenValueTwo = 'George Hill',
		givenValueThree = 'Kevin Love',
		givenValues = [
			givenValueOne,
			givenValueTwo,
			givenValueThree
		];

	let subjectTester: SubjectTester;

	beforeEach(() => {
		subjectTester = new SubjectTester();
	});

	it('should have base value', (done) => {

		// given
		let subject = new BehaviorSubject<string>(givenValueOne),
			expectedValues = [givenValueOne];

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





});
