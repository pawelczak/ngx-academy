import { Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('ContentChild -', () => {

	@Component({
		selector: 'simple',
		template: ``
	})
	class SimpleComponent {
		@Input()
		value: string;
	}

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

	/**
	 * @ContentChildren variables are initialized after the lifecycle hook 'AfterContentInit' is invoked.
	 */
	describe('ngAfterContentInit -', () => {

		@Component({
			selector: 'test',
			template: `

				<content-child>
					<simple [value]="'#1'">#1</simple>
				</content-child>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildComponent)
			compRef: ContentChildComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildComponent,
					TestComponent
				]
			});
		});

		/**
		 * Before the AfterContentInit lifecycle hook occurs
		 * @ContentChildren variables are undefined
		 */
		it('should accessible after AfterContentInit lifecycle', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			/**
			 * Before AfterContentInit, ContentChild should refer to empty Object of wanted Class
			 * In this case it should be SimpleComponent({}), object without any properties
			 * SimpleComponent#value should be undefined
			 */
			expect(fixture.componentInstance.compRef.simpleComponent).toBeDefined();
			expect(fixture.componentInstance.compRef.simpleComponent instanceof SimpleComponent).toBeTruthy();
			expect(fixture.componentInstance.compRef.simpleComponent.value).toBeUndefined();

			/**
			 * After AfterContentInit, refered object should be initialized
			 * SimpleComponent#value should be defined
			 */
			fixture.detectChanges();
			expect(fixture.componentInstance.compRef.simpleComponent).toBeDefined();
			expect(fixture.componentInstance.compRef.simpleComponent instanceof SimpleComponent).toBeTruthy();
			expect(fixture.componentInstance.compRef.simpleComponent.value).toBe('#1');
		});

	});

	xdescribe('component references -', () => {

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

	xdescribe('ng-template references -', () => {

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

	xdescribe('template variable references -', () => {

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

	describe('content changes -', () => {

		@Component({
			selector: 'test',
			template: `

				<content-child>

					<simple *ngIf="flag"
							[value]="'#1'" >
					</simple>

					<simple *ngIf="!flag"
							[value]="'#2'" >
					</simple>

				</content-child>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildComponent)
			compRef: ContentChildComponent;

			flag: boolean = true;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildComponent,
					TestComponent
				]
			});
		});

		it ('should change content values', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			let simpleCompRefs: Array<SimpleComponent> = [];

			// when & then
			fixture.detectChanges();

			expect(compInstance.compRef.simpleComponent).toBeDefined();
			expect(compInstance.compRef.simpleComponent instanceof SimpleComponent).toBeTruthy();
			expect(compInstance.compRef.simpleComponent.value).toBe('#1');

			// when & then
			compInstance.flag = false;
			fixture.detectChanges();

			expect(compInstance.compRef.simpleComponent).toBeDefined();
			expect(compInstance.compRef.simpleComponent instanceof SimpleComponent).toBeTruthy();
			expect(compInstance.compRef.simpleComponent.value).toBe('#2');
		});

	})

});
