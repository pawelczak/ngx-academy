import { Injectable, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * ProvidedIn allows to specify to which module
 * decorated service should be added as a provided class.
 */
describe('Injectable - providedIn -', () => {

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

});