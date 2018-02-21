import { InjectionToken, Injector, StaticProvider } from '@angular/core';


describe('Dependency injection - providers -', () => {

	class Service {}

	describe('useClass -', () => {

		it ('should work', () => {

			//given
			const providers = [{
				provide: Service,
				useClass: Service,
				deps: []
			} as StaticProvider];

			// when
			const injector = Injector.create(providers);

			// then
			expect(injector.get(Service)).toBeDefined();
			expect(injector.get(Service) instanceof Service).toBe(true);
		});
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
			const injector = Injector.create(providers);

			// then
			expect(injector.get(Service)).toBe(service);
		});
	});

	/**
	 * Method 'useExisting' is mostly used for aliasing
	 */
	describe('useExisting -', () => {

		it ('should work', () => {

			//given
			const serviceInjectionToken = new InjectionToken('existing.service');
			const providers = [
				{
					provide: Service,
					deps: []
				} as StaticProvider,
				{
				provide: serviceInjectionToken,
				useExisting: Service
			}];

			// when
			const injector = Injector.create(providers);

			// then
			expect(injector.get(serviceInjectionToken)).toBeDefined();
			expect(injector.get(serviceInjectionToken) instanceof Service).toBe(true);
		});
	});

	describe('useFactory -', () => {

		it ('should work', () => {

			//given
			const providers = [
				{
					provide: Service,
					useFactory: () => {
						return new Service();
					},
					deps: []
				} as StaticProvider];

			// when
			const injector = Injector.create(providers);

			// then
			expect(injector.get(Service)).toBeDefined();
			expect(injector.get(Service) instanceof Service).toBe(true);
		});

		it ('should create service with dependencies', () => {

			class ServiceWithDeps {

				constructor(public service: Service) {}
			}

			//given
			const providers = [
				{
					provide: Service,
					deps: []
				} as StaticProvider,
				{
					provide: ServiceWithDeps,
					useFactory: (service: Service) => {
						return new ServiceWithDeps(service);
					},
					deps: [
						Service
					]
				}];

			// when
			const injector = Injector.create(providers);

			// then
			expect(injector.get(ServiceWithDeps)).toBeDefined();
			expect(injector.get(ServiceWithDeps) instanceof ServiceWithDeps).toBe(true);
			expect(injector.get(ServiceWithDeps).service).toBeDefined();
			expect(injector.get(ServiceWithDeps).service instanceof Service).toBe(true);
		});

	});

});
