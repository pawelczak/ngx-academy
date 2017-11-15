import { Component, ContentChild, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('ContentChild -', () => {

	describe('cotent references -', () => {

		@Component({
			selector: 'simple',
			template: ``
		})
		class SimpleComponent {}

		@Component({
			selector: 'content-child',
			template: ``
		})
		class ContentChildComponent {

			@ContentChild(SimpleComponent)
			simpleComponent: SimpleComponent;

		}

		@Component({
			selector: 'root',
			template: `
				<content-child>
					<simple></simple>
				</content-child>
			`
		})
		class RootComponent {
			@ViewChild(ContentChildComponent)
			contentChildRef: ContentChildComponent;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						RootComponent,
						ContentChildComponent,
						SimpleComponent
					]
				});
		});

		it ('should be possible to get reference to component', () => {

			// given
			const fixture = TestBed.createComponent(RootComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.contentChildRef.simpleComponent).toBeDefined();
			expect(compInstance.contentChildRef.simpleComponent instanceof SimpleComponent).toBeDefined();
		});

	});

});
