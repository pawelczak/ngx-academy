import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('ContentChild -', () => {

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

		/**
		 * component references
		 */
		@ContentChild(SimpleComponent)
		simpleComponent: SimpleComponent;

		/**
		 * ng-template references
		 */
		@ContentChild(TemplateRef)
		templateRef: TemplateRef<any>;

		/**
		 * template variables references
		 */
		@ContentChild('templateOne')
		templateOneVarRef: TemplateRef<any>;

		@ContentChild('templateTwo')
		templateTwoVarRef: TemplateRef<any>;

		@ContentChild('templateThree')
		templateThreeVarRef: TemplateRef<any>;

	}

	describe('component references -', () => {

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
			expect(compInstance.contentChildRef.simpleComponent instanceof SimpleComponent).toBeTruthy();
		});

	});

	describe('ng-template references -', () => {

		@Component({
			selector: 'root',
			template: `
				<content-child>
					<ng-template #templateOne ></ng-template>
					<ng-template #templateTwo ></ng-template>
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

		it ('should be possible to get reference to component via ng-template', () => {

			// given
			const fixture = TestBed.createComponent(RootComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.contentChildRef.templateRef).toBeDefined();
			expect(compInstance.contentChildRef.templateRef instanceof TemplateRef).toBeTruthy();
		});


		it ('ng-template should get reference to first declared ng-template', () => {

			// given
			const fixture = TestBed.createComponent(RootComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.contentChildRef.templateRef).toEqual(compInstance.contentChildRef.templateOneVarRef);
		});

	});

	describe('template variable references -', () => {

		@Component({
			selector: 'root',
			template: `
				<content-child>
					<ng-template #templateOne ></ng-template>
					<ng-template #templateTwo ></ng-template>
					<ng-template #templateThree ></ng-template>
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

		it ('should be possible to get reference to component via template variable', () => {

			// given
			const fixture = TestBed.createComponent(RootComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.contentChildRef.templateOneVarRef).toBeDefined();
			expect(compInstance.contentChildRef.templateOneVarRef instanceof TemplateRef).toBeTruthy();
			expect(compInstance.contentChildRef.templateTwoVarRef).toBeDefined();
			expect(compInstance.contentChildRef.templateTwoVarRef instanceof TemplateRef).toBeTruthy();
			expect(compInstance.contentChildRef.templateThreeVarRef).toBeDefined();
			expect(compInstance.contentChildRef.templateThreeVarRef instanceof TemplateRef).toBeTruthy();
		});

	});

});
