describe('Decorators - class -', () => {

	describe('basic -', () => {

		function engine(constructor: Function) {
			constructor.prototype.engineType = 'Diesel';
		}

		@engine
		class Car {
		}

		it('should add value to decorated object', () => {

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual('Diesel');
		});
	});

	/**
	 * Decorator factory need to return function.
	 */
	describe('decorator factory -', () => {

		function engine(type: string = 'Diesel') {
			return function (constructor: Function) {
				constructor.prototype.engineType = type;
			};
		}

		it('should add value to object', () => {

			// given
			@engine()
			class Car {
			}

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual('Diesel');
		});

		/**
		 * It is possible to pass values to decorator functions.
		 */
		it('should assign passed value to the decorator', () => {

			// given
			const engineType = 'Hybrid';

			@engine(engineType)
			class Car {
			}

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual(engineType);
		});
	});

	describe('class decorator -', () => {

		// given
		const givenEngineType = 'Hybrid';

		function engine<T extends { new(...args: any[]): {} }>(constructor: T) {
			return class extends constructor {
				engineType = givenEngineType;
			}
		}

		it('should work', () => {

			@engine
			class Car {
			}

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual(givenEngineType);
		});

	});

	describe('class decorator factory -', () => {

		const givenEngineType = 'Diesel';

		function engine(type = givenEngineType) {
			return function <T extends { new(...args: any[]): {} }>(constructor: T) {
				return class extends constructor {
					engineType = type;
				}
			}
		}

		it('should work', () => {

			// given
			@engine()
			class Car {
			}

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual(givenEngineType);
		});

		it('should work with arguments', () => {

			// given
			const engineType = 'Hybrid';

			@engine(engineType)
			class Car {
			}

			// when
			let car = new Car() as any;

			// then
			expect(car.engineType).toEqual(engineType);
		});

	});

});
