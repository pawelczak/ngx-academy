import { Component, Inject, InjectionToken, Injector, Optional, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component - reference -', () => {

	/**
	 * Getting reference to the parentComponent from the child level.
	 *
	 * <parent>
	 *     <child></child> <-- injected ParentComponent
	 * </parent>
	 *
	 */
	describe('DI -', () => {

		describe('getting parent component reference from child', () => {

			/**
			 * I'm getting reference to childComponent with this trick,
			 * because ViewChild creates circular dependencies.
			 */
			let childRef: any;

			@Component({
				selector: 'parent',
				template: `
					<child></child>`
			})
			class ParentComponent {
			}

			@Component({
				selector: 'child',
				template: ``
			})
			class ChildComponent {
				constructor(@Optional() public parentComponent: ParentComponent,
							public injector: Injector) {
					childRef = this;
				}
			}

			beforeEach(() => {

				// given
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							ParentComponent,
							ChildComponent
						]
					});

				const fixture = TestBed.createComponent(ParentComponent);
				fixture.detectChanges();
			});

			it('should get parent component from the DI context', () => {

				// when & then
				const parentRef = childRef.parentComponent;

				expect(parentRef instanceof ParentComponent).toBeTruthy();
			});

			it('should add component to the injector', () => {

				// when & then
				const parentRef = childRef.injector.get(ParentComponent);

				expect(parentRef instanceof ParentComponent).toBeTruthy();
			});

		});

		/**
		 * ViewChild in Parent Component creates circular dependency.
		 * One way of dealing with this kind of issue is to use useExisting
		 * provider method.
		 */
		describe('circular dependency', () => {

			it('should be possible to ParentComponent by using DI', () => {

				const parentToken = new InjectionToken<ParentComponent>('parentRef');

				@Component({
					selector: 'child',
					template: ``
				})
				class ChildComponent {
					constructor(@Inject(parentToken) public parentComponent: any) {
					}
				}

				@Component({
					selector: 'parent',
					template: `
						<child></child>`,
					providers: [{
						provide: parentToken,
						useExisting: ParentComponent
					}]
				})
				class ParentComponent {
					@ViewChild(ChildComponent, { static: true })
					childRef: ChildComponent;
				}

				// given
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							ParentComponent,
							ChildComponent
						]
					});

				// when
				const fixture = TestBed.createComponent(ParentComponent);
				fixture.detectChanges();

				// then
				const parentRef = fixture.componentInstance.childRef.parentComponent;

				expect(parentRef instanceof ParentComponent).toBeTruthy();
			});
		});
	});
});
