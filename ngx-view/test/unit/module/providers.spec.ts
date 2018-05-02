import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Module providers scope -', () => {

	class Service {}

	class AppService extends Service {}

	class RootService extends Service {}

	@Component({
		template: ``
	})
	class AppComponent {
		constructor(public service: Service) {}
	}

	@Component({
		template: ``
	})
	class RootComponent {
		constructor(public service: Service) {}
	}

	@NgModule({
		providers: [
			{provide: Service, useClass: AppService},
			{provide: AppService, useClass: AppService}
		],
		declarations: [
			AppComponent
		]
	})
	class AppModule {}

	@NgModule({
		imports: [
			AppModule
		],
		providers: [
			{provide: Service, useClass: RootService},
			{provide: RootService, useClass: RootService}

		],
		declarations: [
			RootComponent
		]
	})
	class RootModule {}

	/**
	 * Consider hierarchy of modules like:
	 *
	 * Root
	 *  |
	 * AppModule
	 *
	 * In the process of compilation all providers from all the modules
	 * are being taken into single array of modules.
	 */
	describe('global scope -', () => {

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						RootModule
					]
				});
		});

		/**
		 * RootModuleService is provided only in the RootModule
		 */
		it('should take service from RootModule', () => {

			// when
			let service = TestBed.get(RootService);

			// then
			expect(service instanceof RootService).toBeTruthy();
		});

		/**
		 * AppService is provided only in the AppModule
		 */
		it('should take service from AppModule', () => {

			// when
			let service = TestBed.get(AppService);

			// then
			expect(service instanceof AppService).toBeTruthy();
		});

		/**
		 * Both modules (RootModule, AppModule) provide record for token 'Service'.
		 * Compilation process removes all the duplications, so it will allow
		 * only one instance of the same Service. The question is which one?
		 * The answer is that it takes the service that is from the module
		 * which is higher in the hierarchy.
		 */
		it('should take Service from RootModule', () => {

			// when
			let service = TestBed.get(Service);

			// then
			expect(service instanceof RootService).toBeTruthy();
			expect(service instanceof AppService).toBeFalsy();
		});

		/**
		 * No matter in which module service has been provided,
		 * always the one from the highest module is taken.
		 */
		it('should inject RootService to RootComponent', () => {

			// given & when
			const fixture = TestBed.createComponent(RootComponent);

			// then
			const service = fixture.componentInstance.service;

			expect(service instanceof RootService).toBeTruthy();
		});

		it('should inject RootService to AppComponent', () => {

			// given & when
			const fixture = TestBed.createComponent(AppComponent);

			// then
			const service = fixture.componentInstance.service;

			expect(service instanceof RootService).toBeTruthy();
		});

	});

});
