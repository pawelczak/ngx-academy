import { Component, ContentChild, Optional, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component -', () => {

	const givenTitle = 'Great Title';

	class ProvidersService {
		value = givenTitle;
	}

	class ViewProvidersService {
		value = givenTitle;
	}

	@Component({
		selector: 'child',
		template: ``
	})
	class ChildComponent {
		constructor(@Optional() public providersService: ProvidersService,
					@Optional() public viewProvidersService: ViewProvidersService) {
		}
	}

	/**
	 * Component property viewProviders add service to the context of the component.
	 * Component and all of its children can use injected service.
	 */
	describe('viewProviders -', () => {

		@Component({
			viewProviders: [
				ViewProvidersService
			],
			template: `<child></child>`
		})
		class ParentComponent {
			@ViewChild(ChildComponent)
			childRef: ChildComponent;

			constructor(public viewProvidersService: ViewProvidersService) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ChildComponent,
						ParentComponent
					]
				});
		});

		/**
		 * Provider added to viewProviders allows to use it in the injected component
		 * and all of its children.
		 */
		it('should add provider to context', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.viewProvidersService.value).toEqual(givenTitle, 'ViewProvidersService parent injector');
			expect(fixture.componentInstance.childRef.viewProvidersService.value).toEqual(givenTitle, 'ViewProvidersService child injector');

		});

	});

	describe('viewProviders - ng-content -', () => {

		@Component({
			selector: 'parent',
			viewProviders: [
				ViewProvidersService
			],
			providers: [
				ProvidersService
			],
			template: `
				<ng-content></ng-content>
			`
		})
		class ParentComponent {
			@ContentChild(ChildComponent)
			contentChildRef: ChildComponent;

			constructor(public providersService: ProvidersService,
						public viewProvidersService: ViewProvidersService) {}
		}

		@Component({
			template: `
				<parent>
					<child></child>
				</parent>
			`
		})
		class TestComponent {
			@ViewChild(ParentComponent)
			compRef: ParentComponent;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ChildComponent,
						ParentComponent,
						TestComponent
					]
				});
		});

		/**
		 * Services provided in component property providers and viewProviders
		 * should be accessible to the component.
		 */
		it ('should be possible for parent component to use services from providers and viewProviders', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const parent = fixture.componentInstance.compRef;

			// expect(true).toBe(false)
			expect(parent.providersService.value).toBe(givenTitle);
			expect(parent.viewProvidersService.value).toBe(givenTitle);
		});

		/**
		 * ContentChild component shouldn't have access to the services provided in the viewProviders.
		 */
		it ('should not be possible to access viewProviders from projected content', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const child = fixture.componentInstance.compRef.contentChildRef;

			expect(child.providersService.value).toEqual(givenTitle);
			expect(child.viewProvidersService).toBeNull();
		});


	});

});
