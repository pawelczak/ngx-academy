describe('Decorators -', () => {

	describe('class -', () => {

		describe('basic -', () => {

			function engine(constructor: Function) {
				constructor.prototype.engineType = 'Diesel';
			}

			@engine
			class Car {}

			it('should add value to decorated object', () => {

				let car = new Car() as any;

				expect(car.engineType).toEqual('Diesel');
			});
		});

	});
});
