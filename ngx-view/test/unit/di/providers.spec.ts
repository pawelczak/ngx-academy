import { InjectionToken, ReflectiveInjector } from '@angular/core';

describe('Dependency injection - providers -', () => {


	class Service {}

	describe('useClass -', () => {

		it ('should work', () => {

			//given
			const providers = [{
				provide: Service,
				useClass: Service
			}];

			// when
			const injector = ReflectiveInjector.resolveAndCreate(providers);

			// then
			expect(injector.get(Service)).toBeDefined();
			expect(injector.get(Service) instanceof Service).toBe(true);
		})
	});

	describe('useValue -', () => {

		it ('should work', () => {

			//given
			const service = new Service();
			const providers = [{
				provide: Service,
				useValue: service
			}];

			// when
			const injector = ReflectiveInjector.resolveAndCreate(providers);

			// then
			expect(injector.get(Service)).toBe(service);
		})
	});

	describe('useExisting -', () => {

		it ('should work', () => {

			//given
			const serviceInjectionToken = new InjectionToken('existing.service');
			const providers = [
				Service,
				{
				provide: serviceInjectionToken,
				useExisting: Service
			}];

			// when
			const injector = ReflectiveInjector.resolveAndCreate(providers);

			// then
			expect(injector.get(serviceInjectionToken)).toBeDefined();
			expect(injector.get(serviceInjectionToken) instanceof Service).toBe(true);
		})
	});

	describe('useFactory -', () => {

		it ('should work', () => {

			//given
			const providers = [
				{
					provide: Service,
					useFactory: () => {
						return new Service();
					}
				}];

			// when
			const injector = ReflectiveInjector.resolveAndCreate(providers);

			// then
			expect(injector.get(Service)).toBeDefined();
			expect(injector.get(Service) instanceof Service).toBe(true);
		})
	});

});
