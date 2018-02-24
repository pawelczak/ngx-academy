import { Component, forwardRef, Inject, InjectionToken, Injector, NgModule, ViewChild } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';


describe('Dependency injection - providers - multi -', () => {

	/**
	 * Creating multi provider with Injector.create
	 */
	describe('Injector -', () => {

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
			constructor(@Inject(token) public multiValue: any) {}
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
		class TestModule {}

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
			class SecondTestModule {}

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
				template: `<multi></multi>`,
				providers: [{
					provide: token,
					useValue: givenValueTwo,
					multi: true
				}]
			})
			class ParentComponent {
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						MultiComponent
					]
				});
			});

			it('should provide values declared in component', () => {

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

	describe ('modules imports -', () => {

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
				forwardRef(() => ChildComponent),
				forwardRef(() => EmptyComponent)
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

		@Component({
			selector: 'empty',
			template: ``
		})
		class EmptyComponent {
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

		describe ('component context -', () => {

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
				// expect(compInstance.child.parentInjector.get(token)).toEqual(expectedParentCompValues);
			});

		});

		describe ('modules context -', () => {

			it ('should provide values from modules', () => {

				// given
				const fixture = TestBed.createComponent(EmptyComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.multiValue).toEqual(['child module', 'root module']);
			});

			it ('should provide values only from one context - module', () => {

				// given
				const injector = getTestBed(),
					expectedValues = ['child module', 'root module'];

				// when & then
				expect(injector.get(token)).toEqual(expectedValues);
			});

		});


		xit ('modules and components have separate sets of providers', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				compInstance = fixture.componentInstance,
				expectedParentCompValues = ['parent component'],
				expectedChildCompValues = ['child component'];

			// when
			fixture.detectChanges();

			// then
			// expect(compInstance.injector.get(token)).toEqual(expectedParentCompValues);
			// expect(compInstance.child.injector.get(token)).toEqual(expectedChildCompValues);

			// expect(compInstance.child.injector.get(Injector)).toEqual(['child module', 'root module']);

		});

	});

});
