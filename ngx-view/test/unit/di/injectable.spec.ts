import { forwardRef, Inject, Injectable, INJECTOR, NgModule } from '@angular/core';
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

		/**
		 * Service providedIn 'root' means that service
		 * will be added to the root injector context.
		 * RootInjector is located higher than the ApplicationInjector.
		 */
		describe('root -', () => {

			@Injectable({
				providedIn: 'root'
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

			it('should allow to provide service at root level', () => {

				// given & when
				let service = TestBed.get(ProvidedInService);

				// then
				expect(service).toBeDefined();
				expect(service instanceof ProvidedInService).toBeTruthy();
			});
		});

		describe('module -', () => {

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
				expect(service instanceof ProvidedInService).toBeTruthy();
			});
		});

		describe('factory -', () => {

			describe('basic -', () => {

				@Injectable({
					providedIn: EmptyModule,
					useFactory: () => {
						return new ProvidedInService();
					}
				})
				class ProvidedInService {
				}

				it('should create service with provided factory function', () => {

					// given
					TestBed
						.configureTestingModule({
							imports: [
								EmptyModule
							]
						});

					// when
					let service = TestBed.get(ProvidedInService);

					// then
					expect(service).toBeDefined();
					expect(service instanceof ProvidedInService).toBeTruthy();
				});
			});

			/**
			 * 'useFactory' doesn't allow to provide dependencies to
			 * the factory function.
			 */
			describe('dependencies -', () => {

				@Injectable()
				class DepService {}

				@NgModule({
					providers: [
						DepService
					]
				})
				class ModuleWithDependency {}

				@Injectable({
					providedIn: ModuleWithDependency,
					useFactory: (depService: DepService) => {
						return new ProvidedInService(depService);
					}
				})
				class ProvidedInService {
					constructor(public depService: DepService) {}
				}

				beforeEach(() => {
					TestBed
						.configureTestingModule({
							imports: [
								ModuleWithDependency
							]
						});
				});

				it('should create service without dependencies', () => {

					// given & when
					let service = TestBed.get(ProvidedInService);

					// then
					expect(service.depService).toBeUndefined();
				});
			});
		});

	});

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
