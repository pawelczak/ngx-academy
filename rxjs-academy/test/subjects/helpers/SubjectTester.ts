export class SubjectTester {

	private counter = 0;

	assertValue(value: string, expectedValues: Array<string>): void {
		expect(value).toEqual(expectedValues[this.counter]);
		this.counter += 1;
	}

	assertNumberOfAssertions(assertionNumber: number): void {
		expect(assertionNumber).toEqual(this.counter, 'Number of assertions');
	}
}
