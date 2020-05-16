import { Component, Inject, InjectionToken, Injector, NgModule, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Dependency injection - providers - multi -', () => {

	/**
	 * Creating multi provider with Injector.create
	 */
	describe('Injector -', () => {

		it('should create array of services', () => {

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
			const injector = Injector.create({providers});

			// then
			expect(injector.get(token)).toEqual(providerValues);
		});

	});

	const token = new InjectionToken('multi_modules');

	/**
	 * Multi providers declared in @NgModule
	 */
	describe('ngModule -', () => {

		const givenValueOne = 'Bruce';

		@Component({
			template: ``
		})
		class MultiComponent {
			constructor(@Inject(token) public multiValue: any) {
			}
		}

		@NgModule({
			providers: [{
				provide: token,
				useValue: givenValueOne,
				multi: true
			}],
			declarations: [
				MultiComponent
			]
		})
		class TestModule {
		}

		describe('single module -', () => {

			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [
						TestModule
					]
				});
			});

			/**
			 * Component has values provided in @NgModule
			 */
			it('should provide values declared in module', () => {

				// given
				const fixture = TestBed.createComponent(MultiComponent),
					compInstance = fixture.componentInstance,
					expectedValue = [givenValueOne];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedValue);
			});

		});

		/**
		 * Providers in two different ngModules
		 * Modules imported at the same level of hierarchy
		 */
		describe('multiple modules -', () => {

			const givenValueTwo = 'Wayne';

			@NgModule({
				providers: [{
					provide: token,
					useValue: givenValueTwo,
					multi: true
				}]
			})
			class SecondTestModule {
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [
						TestModule,
						SecondTestModule
					]
				});
			});

			it('should provide values declared in module', () => {

				// given
				const fixture = TestBed.createComponent(MultiComponent),
					compInstance = fixture.componentInstance,
					expectedValue = [givenValueOne, givenValueTwo];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedValue);
			});

		});

	});

	/**
	 * Multi providers declared at the @Component level
	 */
	describe('Components -', () => {

		const givenValueOne = 'Han';

		@Component({
			selector: 'multi',
			template: ``,
			providers: [{
				provide: token,
				useValue: givenValueOne,
				multi: true
			}]
		})
		class MultiComponent {
			constructor(@Inject(token) public multiValue: any) {
			}
		}

		describe('single component -', () => {

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						MultiComponent
					]
				});
			});

			/**
			 * Component has values provided in @Component
			 */
			it('should provide values declared in component', () => {

				// given
				const fixture = TestBed.createComponent(MultiComponent),
					compInstance = fixture.componentInstance,
					expectedValue = [givenValueOne];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedValue);
			});

		});

		/**
		 * Providing values for the same token, at different level of hierarchy
		 * doesn't merge providers, it overrides them.
		 * Multi level providers doesn't allow to merge provider.
		 */
		describe('multi level components -', () => {

			const givenValueTwo = 'Solo';

			@Component({
				template: `
					<multi></multi>`,
				providers: [{
					provide: token,
					useValue: givenValueTwo,
					multi: true
				}]
			})
			class ParentComponent {
				@ViewChild(MultiComponent, { static: true })
				multiComp: MultiComponent;
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						MultiComponent,
						ParentComponent
					]
				});
			});

			it('should provide values declared only in the component', () => {

				// given
				const fixture = TestBed.createComponent(ParentComponent),
					compInstance = fixture.componentInstance.multiComp,
					expectedValue = [givenValueOne];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedValue);
				expect(compInstance.multiValue).not.toEqual([givenValueOne, givenValueTwo]);
			});
		});

		/**
		 * Component providers overwrite NgModule providers.
		 * Providing multi value in the module will be overwritten
		 * by the values provided in the component.
		 */
		describe('components & modules -', () => {

			const givenValueTwo = 'Solo';

			@NgModule({
				providers: [{
					provide: token,
					useValue: givenValueTwo,
					multi: true
				}],
				declarations: [
					MultiComponent
				]
			})
			class TestModule {
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [
						TestModule
					]
				});
			});

			it('should provide values declared only in the component', () => {

				// given
				const fixture = TestBed.createComponent(MultiComponent),
					compInstance = fixture.componentInstance,
					expectedValue = [givenValueOne];

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(expectedValue);
				expect(compInstance.multiValue).not.toEqual([givenValueOne, givenValueTwo]);
			});
		});
	});


	/**
	 * Using multi allows to inject not only by @Inject,
	 * but also by provided class type.
	 */
	describe('inject method -', () => {

		class Service {}

		@Component({
			template: ``,
			providers: [{
				provide: Service,
				useClass: Service,
				multi: true
			}, {
				provide: Service,
				useClass: Service,
				multi: true
			}]
		})
		class MultiComponent {

			services: Array<Service>;

			/**
			 * There is a mixup here, because it is declared to inject Service,
			 * but what I really expected is an Array of Services.
			 * If I write Array<Service> angular will not recognize it.
			 */
			constructor(public injectedServices: Service) {
				this.services = this.injectedServices as Array<Service>;
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					MultiComponent
				],
				providers: [
					Service
				]
			});
		});

		it('should provide values services', () => {

			// given
			const fixture = TestBed.createComponent(MultiComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.services).toBeDefined();
			expect(compInstance.services.length).toBe(2);
			compInstance.services.forEach((service: Service) => {
				expect(service instanceof Service).toBe(true);
			});
		});
	});

});
