import { Component, ContentChild, Directive, forwardRef, Injector, Self, StaticProvider, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ParentComponent } from './helpers/parent.component';
import { ChildComponent } from './helpers/child.component';
import { FixedChildComponent } from './helpers/fixed-child.component';


describe('ForwardRef -', () => {

	/**
	 * Declare class providers before class has been declared
	 */
	describe('basic -', () => {

		it('basic example', () => {

			// given
			const providers = [
				{
					provide: forwardRef(() => Car),
					deps: []
				} as StaticProvider
			];

			class Car {
			}

			// when
			const injector = Injector.create({providers});

			// then
			expect(injector.get(Car)).toBeDefined();
		});
	});

	describe('circular dependencies', () => {

		/**
		 * Directive wants to add to dependencies itself. That creates a circular dependency.
		 *
		 * Providers for directive are created before the directive is declared.
		 * Using forwardRef lets you declare Directive as a provider before it is used.
		 *
		 * Than other directive can inject reference to the first one using di.
		 * This works because directives created on same node share injector (View).
		 */
		it('should be possible to inject directive as its own dependency', () => {

			// given
			class ForwardedDirectiveRef {
			}

			const providers = [{
				provide: ForwardedDirectiveRef,
				useExisting: forwardRef(() => ForwardedDirective)
			}];

			@Directive({
				selector: '[forwarded]',
				exportAs: 'dirRef',
				providers: providers
			})
			class ForwardedDirective {
				value = 'Forward directive';
			}

			@Directive({
				selector: '[catch]',
				exportAs: 'catchRef'
			})
			class CatchDirective {
				constructor(@Self() public forwardedDirectiveRef: ForwardedDirectiveRef) {
				}
			}

			@Component({
				selector: 'test',
				template: `<span forwarded #dirRef="dirRef" catch #catchRef="catchRef"></span>`
			})
			class TestComponent {
				@ViewChild(ForwardedDirective, { static: true })
				dirRef: ForwardedDirective;

				@ViewChild(CatchDirective, { static: true })
				catchRef: CatchDirective;
			}

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ForwardedDirective,
						CatchDirective,
						TestComponent
					],
					providers: []
				});

			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.dirRef).toBeDefined();
			expect(compInstance.catchRef).toBeDefined();
			expect((compInstance.catchRef.forwardedDirectiveRef as ForwardedDirective).value).toBe('Forward directive');
			expect(compInstance.catchRef.forwardedDirectiveRef).toBe(compInstance.dirRef);
		});

		/**
		 * Circular dependency between two components.
		 *
		 * Both of them wants to have a reference the second one
		 * as a ContentChild.
		 *
		 * <parent>
		 * 		<child>
		 * 			<parent>
		 * 				...
		 * 			</parent>
		 * 		</child>
		 * 	</parent>
		 */
		describe('recursion -', () => {

			@Component({
				template: `
						<parent>
							<child>
								<parent>
									<child></child>
								</parent>
							</child>
						</parent>
					`
			})
			class TestComponent {}

			/**
			 * Circular dependencies between components. Both Parent & Child component
			 * require each other via ContentChild.
			 *
			 * ParentComponent {
			 * 	@ContentChild(ChildComponent)
			 * 	compRef: ChildComponent;
			 * }
			 *
			 * ChildComponent {
			 * 	@ContentChild(ParentComponent)
			 * 	compRef: ParentComponent;
			 * }
			 */
			it('is not possible to make it work', () => {

				TestBed
					.configureTestingModule({
						declarations: [
							ParentComponent,
							ChildComponent,
							TestComponent
						]
					});

				expect(() => TestBed.createComponent(TestComponent)).toThrowError();
			});

			/**
			 * To break the cycle you need to use forwardRef function in one of the Components.
			 * In this case change was made in the ChildComponent.
			 *
			 * ChildComponent {
			 * 	@ContentChild(forwardRef(() => ParentComponent))
			 * 	compRef: ParentComponent;
			 * }
			 */
			it('is possible to make it work with help of forwardRef', () => {

				TestBed
					.configureTestingModule({
						declarations: [
							ParentComponent,
							FixedChildComponent,
							TestComponent
						]
					});

				expect(() => TestBed.createComponent(TestComponent)).not.toThrowError();
			});
		});
	});

});
