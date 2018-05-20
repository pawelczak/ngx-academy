describe('Function - overloading -', () => {

	describe('arguments -', () => {

		/**
		 * Declare the implementation with union types.
		 */
		it ('should overload primitives', () => {

			// given
			const stringType = 'It\'s a string',
				numberType = 'It\'s a string';

			function play(value: number): string;
			function play(value: string): string;
			function play(value: number | string): string {

				if (typeof value === 'number') {
					return numberType;
				} else if (typeof value === 'string') {
					return stringType;
				} else {
					// default
				}
			}

			// when & then
			expect(play(1000)).toBe(numberType);
			expect(play('text')).toBe(numberType);
		});

		/**
		 * Trick is to specify arguments as optional
		 */
		it('should overload different number of arguments', () => {

			function play(valueOne: number): string;
			function play(valueOne: number, valueTwo: number): string;
			function play(valueOne: number, valueTwo: number, valueThree: number): string;
			function play(valueOne: number, valueTwo: number, valueThree: number, valueFour: number): string;
			function play(valueOne?: number, valueTwo?: number, valueThree?: number, valueFour?: number): string {
				if (arguments.length === 1) {
					return 'A';
				}
				if (arguments.length === 2) {
					return 'B';
				}
				if (arguments.length === 3) {
					return 'C';
				}
				if (arguments.length === 4) {
					return 'D';
				}
			}

			// when & then
			expect(play(1)).toBe('A');
			expect(play(1, 2)).toBe('B');
			expect(play(1, 2, 3)).toBe('C');
			expect(play(1, 2, 3, 4)).toBe('D');
		});

		it ('should be possible to overload number of arguments and types', () => {

			function play(value: number): string;
			function play(value: string): string;
			function play(valueOne: string, valueTwo: string, valueThree: number): string;
			function play(valueOne: number, valueTwo: number, valueThree: number): string;
			function play(valueOne?: number | string, valueTwo?: number | string, valueThree?: number): string {

				if (arguments.length === 1) {
					if (typeof valueOne === 'number') {
						return 'A';
					} else if (typeof valueOne === 'string') {
						return 'B';
					}
				}

				if (arguments.length === 3) {
					if (typeof valueOne === 'number' &&
						typeof valueTwo === 'number') {
						return 'C';
					} else if (typeof valueOne === 'string' &&
							   typeof valueTwo === 'string') {
						return 'D';
					}
				}
			}

			// when & then
			expect(play(1)).toBe('A');
			expect(play('text')).toBe('B');
			expect(play(1, 2, 3)).toBe('C');
			expect(play('text', 'text', 3)).toBe('D');

			// TypeScript throws error coz play doesn't have implementation with two arguments
			// expect(play('text', 'text')).toBe('B');
		});
	});

	describe('return types -', () => {

		it ('should work with primitives', () => {

			function play(value: number): number;
			function play(value: string): string;
			function play(value: number | string): number | string {

				if (typeof value === 'number') {
					return 1;
				} else if (typeof value === 'string') {
					return 'string';
				} else {
					// default
				}
			}

			expect(play(2)).toBe(1);
			expect(play('text')).toBe('string');
		});

	});

});
