import { Component, ContentChild, Directive, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { isViewContainerRef } from '../helpers/matchers';


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
	 * @ContentChild variables are initialized after the lifecycle hook 'AfterContentInit' is invoked.
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


	/**
	 * @ContentChild allows to reference a component
	 * References can be of different types
	 */
	describe ('read component -', () => {

		@Component({
			selector: 'content-child',
			template: ``
		})
		class ContentChildComponent {

			/**
			 * component reference
			 */
			@ContentChild(SimpleComponent)
			compRef: SimpleComponent;

			/**
			 * component reference as ElementRefs
			 */
			@ContentChild(SimpleComponent, {read: ElementRef})
			compAsElementRef: ElementRef;

			/**
			 * component reference as ElementRefs
			 */
			@ContentChild(SimpleComponent, {read: TemplateRef})
			compAsTempRef: TemplateRef<any>;

			/**
			 * component reference as ViewContainerRef
			 */
			@ContentChild(SimpleComponent, {read: ViewContainerRef})
			compAsVcr: ViewContainerRef;

			/**
			 * component reference by template variable
			 */
			@ContentChild('compOne')
			compByTemplVarRef: SimpleComponent;
		}

		@Component({
			selector: 'test',
			template: `

				<content-child>

					<simple #compOne [value]="'#1'" >
					</simple>

					<simple #compTwo [value]="'#2'" >
					</simple>

				</content-child>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildComponent)
			contentChildRef: ContentChildComponent;
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

		it ('should get component as different objects', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let compRef = compInstance.contentChildRef.compRef;
			expect(compRef.value).toBe('#1');
			expect(compRef instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE

			let compAsElemRef = compInstance.contentChildRef.compAsElementRef;
			expect(compAsElemRef instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			let compAsTempRef = compInstance.contentChildRef.compAsTempRef;
			expect(compAsTempRef instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // FALSE

			let compAsVcr = compInstance.contentChildRef.compAsVcr;
			expect(isViewContainerRef(compAsVcr)).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ContentChild allows to get reference to a component by template variable
		 */
		it ('should be possible to get reference by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let compByTemplVarRef = compInstance.contentChildRef.compByTemplVarRef;
			expect(compByTemplVarRef.value).toEqual('#1');
			expect(compByTemplVarRef instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE
		});

	});

	/**
	 * @ContentChild allows to get reference to multiple instances of directives
	 */
	describe ('directive -', () => {

		@Directive({
			selector: '[propDir]',
			exportAs: 'propDir'
		})
		class PropDirective {
			@Input('propDir')
			value: string;
		}

		@Component({
			selector: 'content-child-for-directive',
			template: ``
		})
		class ContentChildForDirectiveComponent {

			/**
			 * directive reference
			 */
			@ContentChild(PropDirective)
			dirRef: PropDirective;

			/**
			 * directive reference as ElementRefs
			 */
			@ContentChild(SimpleComponent, {read: ElementRef})
			dirAsElementRef: ElementRef;

			/**
			 * directive reference as ElementRefs
			 */
			@ContentChild(SimpleComponent, {read: TemplateRef})
			dirAsTempRef: TemplateRef<any>;

			/**
			 * directive reference as ViewContainerRef
			 */
			@ContentChild(SimpleComponent, {read: ViewContainerRef})
			dirAsVcr: ViewContainerRef;

			/**
			 * directive reference by template variable
			 */
			@ContentChild('dirOne')
			dirByTemplVarRef: SimpleComponent;
		}

		@Component({
			selector: 'test',
			template: `

				<content-child-for-directive>
					<p #dirOne="propDir" [propDir]="'#1'" ></p>
					<p #dirTwo="propDir" [propDir]="'#2'" ></p>
					<p #dirThree="propDir" [propDir]="'#3'" ></p>
				</content-child-for-directive>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildForDirectiveComponent)
			contentChildForDirRef: ContentChildForDirectiveComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					PropDirective,
					ContentChildForDirectiveComponent,
					TestComponent
				]
			});
		});

		it ('should get reference to a directive', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let propDirectivesRefs = compInstance.contentChildForDirRef.dirRef;

			expect(propDirectivesRefs.value).toEqual('#1');
			expect(propDirectivesRefs instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE
		});

		/**
		 * When you want to get reference to a directive by @ContentChild, you cannot use read option. It doesn't work.
		 */
		it ('shouldn\'t be possible to use read parameter with directive', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let dirAsElementRefs = compInstance.contentChildForDirRef.dirAsElementRef;
			expect(dirAsElementRefs instanceof ElementRef).toBe(false, 'directiveRef as ElementRef'); // FALSE
			expect(dirAsElementRefs).toBeUndefined();

			let dirAsTempRefs = compInstance.contentChildForDirRef.dirAsTempRef;
			expect(dirAsTempRefs instanceof TemplateRef).toBe(false, 'directiveRef as TemplateRef'); // FALSE
			expect(dirAsTempRefs).toBeUndefined();

			let dirAsVcrs = compInstance.contentChildForDirRef.dirAsVcr;
			expect(isViewContainerRef(dirAsVcrs)).toBe(false, 'directiveRef as ViewContainerRef'); // FALSE
			expect(dirAsVcrs).toBeUndefined();
		});

		/**
		 * @ContentChild allows to get reference to a directive by template variable
		 */
		it ('should get reference by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let dirByTemplVarRefs = compInstance.contentChildForDirRef.dirByTemplVarRef;
			expect(dirByTemplVarRefs.value).toEqual('#1');
			expect(dirByTemplVarRefs instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE
		});

	});

	/**
	 * @ContentChild allows to get different types when referencing a template
	 */
	describe ('read ng-template -', () => {

		@Component({
			selector: 'content-child',
			template: ``
		})
		class ContentChildComponent {

			/**
			 * ng-template reference
			 */
			@ContentChild(TemplateRef)
			templRef: TemplateRef<any>;

			/**
			 * ng-template reference as ElementRefs
			 */
			@ContentChild(TemplateRef, {read: ElementRef})
			templAsElementRef: ElementRef;

			/**
			 * ng-template reference as ElementRefs
			 */
			@ContentChild(TemplateRef, {read: SimpleComponent})
			templAsCompRef: SimpleComponent;

			/**
			 * ng-template reference as ViewContainerRef
			 */
			@ContentChild(TemplateRef, {read: ViewContainerRef})
			templAsVcr: ViewContainerRef;

			/**
			 * component reference by template variable
			 */
			@ContentChild('templOne')
			templByTemplVarRef: SimpleComponent;
		}

		@Component({
			selector: 'test',
			template: `

				<content-child>

					<ng-template #templOne >
					</ng-template>

					<ng-template #templTwo >
					</ng-template>

				</content-child>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildComponent)
			contentChildRef: ContentChildComponent;
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

		it ('should get template references as different objects', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let templRef = compInstance.contentChildRef.templRef;
			expect(templRef).toBeDefined();
			expect(templRef instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE

			let templAsElementRef = compInstance.contentChildRef.templAsElementRef;
			expect(templAsElementRef).toBeDefined();
			expect(templAsElementRef instanceof ElementRef).toBe(true, 'TemplateRef as ElementRef'); // TRUE

			let templAsCompRef = compInstance.contentChildRef.templAsCompRef;
			expect(templAsCompRef).toBeUndefined();
			expect(templAsCompRef instanceof SimpleComponent).toBe(false, 'TemplateRef as SimpleComponent'); // FALSE

			let templAsVcr = compInstance.contentChildRef.templAsVcr;
			expect(templAsVcr).toBeDefined();
			expect(isViewContainerRef(templAsVcr)).toBe(true, 'TemplateRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ContentChild allows to get reference to a template by template variable
		 */
		it ('should be possible to get reference to a template by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let templByTemplVarRef = compInstance.contentChildRef.templByTemplVarRef;
			expect(templByTemplVarRef).toBeDefined();
			expect(templByTemplVarRef instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE
		})

	});

	describe('content changes -', () => {

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
		}

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

	});

	describe('set -', () => {

		const givenValue = 'Ciri';

		@Component({
			selector: 'content-child',
			template: ``
		})
		class ContentChildComponent {

			simpleRef: SimpleComponent;

			/**
			 * component references
			 */
			@ContentChild(SimpleComponent)
			set simpleComponent(simple: SimpleComponent) {
				this.simpleRef = simple;
			}
		}

		@Component({
			selector: 'test',
			template: `

				<content-child>

					<simple [value]="'${givenValue}'" >
					</simple>
					
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

		it('should work with typescript setter', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compRef = fixture.componentInstance.compRef;

			// when
			fixture.detectChanges();

			// then
			expect(compRef.simpleRef).toBeDefined();
			expect(compRef.simpleRef instanceof SimpleComponent).toBeTruthy();
			expect(compRef.simpleRef.value).toBe(givenValue);
		});
	})

});
