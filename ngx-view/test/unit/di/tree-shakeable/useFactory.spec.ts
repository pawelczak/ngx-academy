import { Injectable, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('useFactory -', () => {

	@NgModule()
	class EmptyModule {
	}

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
