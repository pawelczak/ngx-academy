import { Component, forwardRef, Inject, InjectionToken, Injector, NgModule, StaticProvider, ViewChild } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

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


	describe('multi -', () => {

		it ('should create array of services', () => {

			//given
			const token = new InjectionToken('token');
			const providerValues = ['providerOne', 'providerTwo', 'providerThree'];
			const providers = [{
				provide: token,
				useValue: providerValues[0],
				multi: true
			}, {
				provide: token,
				useValue: providerValues[1],
				multi: true
			}, {
				provide: token,
				useValue: providerValues[2],
				multi: true
			}];

			// when
			const injector = Injector.create(providers);

			// then
			expect(injector.get(token)).toEqual(providerValues);
		});

		describe ('modules imports -', () => {

			const token = new InjectionToken('multi_modules');

			@NgModule({
				imports: [
					forwardRef(() => ChildModule)
				],
				providers: [{
					provide: token,
					useValue: 'root module',
					multi: true
				}]
			})
			class RootModule {}

			@NgModule({
				declarations: [
					forwardRef(() => ParentComponent),
					forwardRef(() => ChildComponent)
				],
				providers: [{
					provide: token,
					useValue: 'child module',
					multi: true
				}]
			})
			class ChildModule {}

			@Component({
				selector: 'parent',
				template: `<child></child>`,
				providers: [{
					provide: token,
					useValue: 'parent component',
					multi: true
				}]
			})
			class ParentComponent {
				@ViewChild(forwardRef(() => ChildComponent))
				child: ChildComponent;

				constructor(public injector: Injector,
							@Inject(token) public multiValue: any) {}
			}

			@Component({
				selector: 'child',
				template: ``,
				providers: [{
					provide: token,
					useValue: 'child component',
					multi: true
				}]
			})
			class ChildComponent {
				constructor(public injector: Injector,
							@Inject(token) public multiValue: any) {}
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [
						RootModule
					]
				});
			});

			it ('should provide values only from component context', () => {

				// given
				const fixture = TestBed.createComponent(ParentComponent),
					compInstance = fixture.componentInstance,
					expectedParentCompValues = ['parent component'],
					expectedChildCompValues = ['child component'];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedParentCompValues);
				expect(compInstance.injector.get(token)).toEqual(expectedParentCompValues);

				expect(compInstance.child.multiValue).toEqual(expectedChildCompValues);
				expect(compInstance.child.injector.get(token)).toEqual(expectedChildCompValues);
			});


			it ('should provide values only from one context - module', () => {

				// given
				const injector = getTestBed(),
					expectedValues = ['child module', 'root module'];

				// when & then
				expect(injector.get(token)).toEqual(expectedValues);
			});

		});

	});

});
