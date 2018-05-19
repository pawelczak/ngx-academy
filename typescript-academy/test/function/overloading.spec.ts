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
			// expect(play(1)).toBe('A');
			expect(play(1, 2)).toBe('B');
			expect(play(1, 2, 3)).toBe('C');
			expect(play(1, 2, 3, 4)).toBe('D');


		});
	});

});
