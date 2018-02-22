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

		@Component({
			template: ``
		})
		class MultiComponent {
			constructor(@Inject(token) public multiValue: any) {}
		}

		@NgModule({
			providers: [{
				provide: token,
				useValue: 'module',
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

		/**
		 * Component has values provided in @NgModule
		 */
		it('should provide values declared in module', () => {

			// given
			const fixture = TestBed.createComponent(MultiComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.multiValue).toEqual(['module']);
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
