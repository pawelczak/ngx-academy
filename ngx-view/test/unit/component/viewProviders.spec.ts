import { Component, Directive, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component -', () => {

	/**
	 * Component property viewProviders add service to the context of the component.
	 * Component and all of its children can use injected service.
	 */
	describe('viewProviders -', () => {

		const givenTitle = 'Great Title';

		class Title {
			value = givenTitle;
		}

		@Component({
			selector: 'title',
			template: `{{title.value}}`
		})
		class ChildComponent {
			constructor(public title: Title) {
			}
		}

		@Component({
			viewProviders: [
				Title
			],
			template: `<title></title>`
		})
		class ParentComponent {
			@ViewChild(ChildComponent)
			childRef: ChildComponent;

			constructor(public title: Title) {}
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
			expect(fixture.componentInstance.title.value).toEqual(givenTitle);
			expect(fixture.componentInstance.childRef.title.value).toEqual(givenTitle);

		});

	});

});
