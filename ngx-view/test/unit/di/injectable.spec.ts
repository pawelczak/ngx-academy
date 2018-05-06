import { Injectable, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('@Injectable() -', () => {

	/**
	 * ProvidedIn allows to specify to which module
	 * decorated sevice should be added as a provided class.
	 */
	describe('providedIn -', () => {

		@NgModule()
		class EmptyModule {
		}

		describe('',() => {

			@Injectable({
				providedIn: EmptyModule
			})
			class ProvidedInService {
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							EmptyModule
						]
					});
			});

			it('should allow to get services provided with use of providedIn', () => {

				// given & when
				let service = TestBed.get(ProvidedInService);

				// then
				expect(service).toBeDefined();
				expect(service instanceof ProvidedInService).toEqual(true);
			});

		});

	});


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
