import { TestBed } from '@angular/core/testing';

describe('@Injectable() -', () => {

	/**
	 * Classes provided as to injector, without Injectable decorator.
	 */
	describe('without -', () => {

		class Car {
			constructor(public engine: Engine) {
			}
		}

		class Engine {
		}

		/**
		 * Creating a service without dependencies doesn't require the @Injectable
		 * annotation.
		 */
		it('should create service without dependencies', () => {

			TestBed
				.configureTestingModule({
					providers: [
						Engine
					]
				});

			expect(() => TestBed.get(Engine)).not.toThrowError();
		});

		/**
		 * When creating a service with dependencies and without Injectable annotation,
		 * Angular should throw an error.
		 */
		it('shouldn\'t be possible to create service with dependencies', () => {

			TestBed
				.configureTestingModule({
					providers: [
						Car,
						Engine
					]
				});

			expect(() => TestBed.get(Car)).toThrowError();
		});
	});

});
