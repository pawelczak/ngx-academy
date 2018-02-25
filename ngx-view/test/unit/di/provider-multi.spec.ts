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
			class TestModule {}

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

});
