import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Module scope -', () => {

	class Service {}

	class ModuleService extends Service {}

	class RootModuleService extends Service {}

	@NgModule({
		providers: [
			{provide: Service, useClass: ModuleService}
		]
	})
	class Module {}

	@NgModule({
		imports: [
			Module
		],
		providers: [
			{provide: Service, useClass: RootModuleService}
		]
	})
	class RootModule {}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [
					RootModule
				]
			});
	});

	it('should take service from root module', () => {

		let service = TestBed.get(Service);

		expect(service instanceof RootModuleService).toBeTruthy();
	});

});
