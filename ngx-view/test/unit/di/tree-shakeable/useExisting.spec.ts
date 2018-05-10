import { Injectable, Injector, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('useExisting -', () => {

	class Service {}

	@NgModule({
		providers: [
			Service
		]
	})
	class Module {}

	describe('basic -', () => {

		@Injectable({
			providedIn: Module,
			useExisting: Service
		})
		class AliasService {}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					Module
				]
			});
		});

		it('should provide useValue service', () => {

			// given
			const aliasService = TestBed.get(AliasService);

			// when & then
			expect(aliasService instanceof Service).toBeTruthy();
		});
	});
});
