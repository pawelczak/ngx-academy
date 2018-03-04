import { InjectionToken, Injector, StaticProvider } from '@angular/core';


describe('Dependency injection - providers -', () => {

	class Service {}

	describe('useClass -', () => {

		it ('should provide instance of a class', () => {

			//given
			const providers = [
				{
					provide: Service,
					useClass: Service,
					deps: []
				} as StaticProvider
			];

			// when
			const injector = Injector.create({providers});

			// then
			const service = injector.get(Service);

			expect(service).toBeDefined();
			expect(service instanceof Service).toBe(true);
		});
	});

	describe('useValue -', () => {

		it ('should provide values', () => {

			//given
			const service = new Service();
			const providers = [
				{
					provide: Service,
					useValue: service
				}
			];

			// when
			const injector = Injector.create({providers});

			// then
			expect(injector.get(Service)).toBe(service);
		});

		/**
		 *	Providing a class to a useValue provider will get you back class,
		 *	not an object of a class.
		 */
		it ('should provide class not instance of class', () => {

			//given
			const providers = [
				{
					provide: Service,
					useValue: Service
				}
			];

			// when
			const injector = Injector.create({providers});

			// then
			const serviceClass: Service = injector.get(Service) as Service;

			expect(serviceClass).toBe(Service);
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
				}
			];

			// when
			const injector = Injector.create({providers});

			// then
			const service = injector.get(serviceInjectionToken);

			expect(service).toBeDefined();
			expect(service instanceof Service).toBe(true);
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
				} as StaticProvider
			];

			// when
			const injector = Injector.create({providers});

			// then
			const service = injector.get(Service);

			expect(service).toBeDefined();
			expect(service instanceof Service).toBe(true);
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
			const injector = Injector.create({providers});

			// then
			const serviceWithDeps = injector.get(ServiceWithDeps);

			expect(serviceWithDeps).toBeDefined();
			expect(serviceWithDeps instanceof ServiceWithDeps).toBe(true);
			expect(serviceWithDeps.service).toBeDefined();
			expect(serviceWithDeps.service instanceof Service).toBe(true);
		});

	});

});
