import { Component, ContentChildren, Directive, ElementRef, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { isViewContainerRef } from './helpers/matchers';


describe('ContentChildren -', () => {

	@Component({
		selector: 'simple',
		template: ``
	})
	class SimpleComponent {
		@Input()
		value: string;
	}

	@Component({
		selector: 'content-children',
		template: ``
	})
	class ContentChildrenComponent {

		/**
		 * component references
		 */
		@ContentChildren(SimpleComponent)
		simpleComponent: QueryList<SimpleComponent>;
	}

	/**
	 * @ContentChildren variables are initialized after the lifecycle hook 'AfterContentInit' is invoked.
	 */
	describe('ngAfterContentInit -', () => {

		@Component({
			selector: 'test',
			template: `

				<content-children>
					<simple [value]="'#1'" >#1</simple>
					<simple [value]="'#2'" >#2</simple>
					<simple [value]="'#3'" >#3</simple>
				</content-children>
			
			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRef: ContentChildrenComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildrenComponent,
					TestComponent
				]
			});
		});

		/**
		 * Before the AfterContentInit lifecycle hook occurs
		 * @ContentChildren variables are undefined
		 */
		it ('should accessible after AfterContentInit lifecycle', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			/**
			 * Before AfterContentInit
			 */
			expect(fixture.componentInstance.compRef.simpleComponent).toBeUndefined();

			/**
			 * After AfterContentInit
			 */
			fixture.detectChanges();
			expect(fixture.componentInstance.compRef.simpleComponent).toBeDefined();
		});

		it ('should be possible to get component instance from QueryList', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			const simpleCompRefs = compInstance.compRef.simpleComponent.toArray();
			expect(simpleCompRefs.length).toEqual(3);
			expect(simpleCompRefs[0].value).toEqual('#1');
			expect(simpleCompRefs[1].value).toEqual('#2');
			expect(simpleCompRefs[2].value).toEqual('#3');
		});

	});

	/**
	 * @ContentChildren allows to get different types when referencing a component
	 */
	describe ('read component -', () => {

		@Component({
			selector: 'content-children',
			template: ``
		})
		class ContentChildrenComponent {

			/**
			 * component references
			 */
			@ContentChildren(SimpleComponent)
			compRefs: QueryList<SimpleComponent>;

			/**
			 * component references as ElementRefs
			 */
			@ContentChildren(SimpleComponent, {read: ElementRef})
			compAsElementRefs: QueryList<ElementRef>;

			/**
			 * component references as ElementRefs
			 */
			@ContentChildren(SimpleComponent, {read: TemplateRef})
			compAsTempRefs: QueryList<TemplateRef<any>>;

			/**
			 * component references as ViewContainerRef
			 */
			@ContentChildren(SimpleComponent, {read: ViewContainerRef})
			compAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * component references by template variable
			 */
			@ContentChildren('compOne')
			compByTemplVarRefs: QueryList<SimpleComponent>;
		}

		@Component({
			selector: 'test',
			template: `

				<content-children>

					<simple #compOne [value]="'#1'" >
					</simple>

					<simple #compTwo [value]="'#2'" >
					</simple>

				</content-children>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRef: ContentChildrenComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildrenComponent,
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
			let compRefs = compInstance.compRef.compRefs.toArray();
			expect(compRefs.length).toEqual(2);
			expect(compRefs[0] instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE

			let compAsElemRefs = compInstance.compRef.compAsElementRefs.toArray();
			expect(compAsElemRefs.length).toEqual(2);
			expect(compAsElemRefs[0] instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			let compAsTempRefs = compInstance.compRef.compAsTempRefs.toArray();
			expect(compAsTempRefs.length).toEqual(2);
			expect(compAsTempRefs[0] instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // FALSE

			let compAsVcrs = compInstance.compRef.compAsVcrs.toArray();
			expect(compAsVcrs.length).toEqual(2);
			expect(isViewContainerRef(compAsVcrs[0])).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ContentChildren allows to get reference to a component by template variable
		 */
		it ('should be possible to get reference by template variable', () => {
			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let compByTemplVarRefs = compInstance.compRef.compByTemplVarRefs.toArray();
			expect(compByTemplVarRefs.length).toEqual(1);
			expect(compByTemplVarRefs[0].value).toEqual('#1');
			expect(compByTemplVarRefs[0] instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE
		});

	});

	/**
	 * @ContentChildren allows to get reference to multiple instances of directives
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
			selector: 'content-children-for-directive',
			template: ``
		})
		class ContentChildrenForDirectiveComponent {

			/**
			 * directive references
			 */
			@ContentChildren(PropDirective)
			dirRefs: QueryList<PropDirective>;

			/**
			 * directive references as ElementRefs
			 */
			@ContentChildren(SimpleComponent, {read: ElementRef})
			dirAsElementRefs: QueryList<ElementRef>;

			/**
			 * directive references as ElementRefs
			 */
			@ContentChildren(SimpleComponent, {read: TemplateRef})
			dirAsTempRefs: QueryList<TemplateRef<any>>;

			/**
			 * directive references as ViewContainerRef
			 */
			@ContentChildren(SimpleComponent, {read: ViewContainerRef})
			dirAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * directive references by template variable
			 */
			@ContentChildren('dirOne')
			dirByTemplVarRefs: QueryList<SimpleComponent>;
		}

		@Component({
			selector: 'test',
			template: `

				<content-children-for-directive>
					<p #dirOne="propDir" [propDir]="'#1'" ></p>
					<p #dirTwo="propDir" [propDir]="'#2'" ></p>
					<p #dirThree="propDir" [propDir]="'#3'" ></p>
				</content-children-for-directive>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenForDirectiveComponent)
			compRef: ContentChildrenForDirectiveComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					PropDirective,
					ContentChildrenForDirectiveComponent,
					TestComponent
				]
			});
		});

		// TODO
		xit ('should be get reference to a directive', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let propDirectivesRefs = compInstance.compRef.dirRefs.toArray();

			expect(propDirectivesRefs.length).toEqual(3);
			expect(propDirectivesRefs[0].value).toEqual('#1');
			expect(propDirectivesRefs[1].value).toEqual('#2');
			expect(propDirectivesRefs[2].value).toEqual('#3');
			expect(propDirectivesRefs[0] instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE

			let dirAsElementRefs = compInstance.compRef.dirAsElementRefs.toArray();
			expect(dirAsElementRefs.length).toEqual(2);
			expect(dirAsElementRefs[0] instanceof ElementRef).toBe(true, 'directiveRef as ElementRef'); // TRUE

			let dirAsTempRefs = compInstance.compRef.dirAsTempRefs.toArray();
			expect(dirAsTempRefs.length).toEqual(2);
			expect(dirAsTempRefs[0] instanceof TemplateRef).toBe(false, 'directiveRef as TemplateRef'); // FALSE

			let dirAsVcrs = compInstance.compRef.dirAsVcrs.toArray();
			expect(dirAsVcrs.length).toEqual(2);
			expect(isViewContainerRef(dirAsVcrs[0])).toBe(true, 'directiveRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ContentChildren allows to get reference to a directive by template variable
		 */
		it ('should be possible to get reference by template variable', () => {
			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let dirByTemplVarRefs = compInstance.compRef.dirByTemplVarRefs.toArray();
			expect(dirByTemplVarRefs.length).toEqual(1);
			expect(dirByTemplVarRefs[0].value).toEqual('#1');
			expect(dirByTemplVarRefs[0] instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE
		});

	});

	/**
	 * @ContentChildren allows to get different types when referencing a template
	 */
	describe ('read ng-template -', () => {

		@Component({
			selector: 'content-children',
			template: ``
		})
		class ContentChildrenComponent {

			/**
			 * ng-template references
			 */
			@ContentChildren(TemplateRef)
			templRefs: QueryList<TemplateRef<any>>;

			/**
			 * ng-template references as ElementRefs
			 */
			@ContentChildren(TemplateRef, {read: ElementRef})
			templAsElementRefs: QueryList<ElementRef>;

			/**
			 * ng-template references as ElementRefs
			 */
			@ContentChildren(TemplateRef, {read: SimpleComponent})
			templAsCompRefs: QueryList<SimpleComponent>;

			/**
			 * ng-template references as ViewContainerRef
			 */
			@ContentChildren(TemplateRef, {read: ViewContainerRef})
			templAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * component references by template variable
			 */
			@ContentChildren('templOne')
			templByTemplVarRefs: QueryList<SimpleComponent>;
		}

		@Component({
			selector: 'test',
			template: `

				<content-children>

					<ng-template #templOne >
					</ng-template>

					<ng-template #templTwo >
					</ng-template>

				</content-children>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRef: ContentChildrenComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildrenComponent,
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
			let templRefs = compInstance.compRef.templRefs.toArray();
			expect(templRefs.length).toEqual(2);
			expect(templRefs[0] instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE

			let templAsElementRefs = compInstance.compRef.templAsElementRefs.toArray();
			expect(templAsElementRefs.length).toEqual(2);
			expect(templAsElementRefs[0] instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			let templAsCompRefs = compInstance.compRef.templAsCompRefs.toArray();
			expect(templAsCompRefs.length).toEqual(0);
			expect(templAsCompRefs[0] instanceof SimpleComponent).toBe(false, 'componentRef as SimpleComponent'); // FALSE

			let templAsVcrs = compInstance.compRef.templAsVcrs.toArray();
			expect(templAsVcrs.length).toEqual(2);
			expect(isViewContainerRef(templAsVcrs[0])).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		/**
		 * ContentChildren allows to get reference to a template by template variable
		 */
		it ('should be possible to get reference to a template by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let templByTemplVarRefs = compInstance.compRef.templByTemplVarRefs.toArray();
			expect(templByTemplVarRefs.length).toEqual(1);
			expect(templByTemplVarRefs[0] instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE
		})

	});

	/**
	 * @ContentChildren allows to read descendants
	 */
	describe ('descendants -', () => {

		@Component({
			selector: 'content-children-descendants',
			template: ``
		})
		class ContentChildrenDescendantsComponent {

			/**
			 * component references with descendants false
			 */
			@ContentChildren(SimpleComponent, {descendants: false})
			simpleComponent: QueryList<SimpleComponent>;

			/**
			 * component references with descendants true
			 */
			@ContentChildren(SimpleComponent, {descendants: true})
			simpleComponentWithDescendants: QueryList<SimpleComponent>;
		}

		@Component({
			selector: 'test',
			template: `

				<content-children-descendants>

					<simple [value]="'#1'" >
					</simple>

					<simple [value]="'#2'" >
						<simple [value]="'#3'" >#3</simple>
					</simple>

				</content-children-descendants>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenDescendantsComponent)
			compRef: ContentChildrenDescendantsComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildrenDescendantsComponent,
					TestComponent
				]
			});
		});

		it ('should get content from first level - no descendants', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let simpleCompRefs = compInstance.compRef.simpleComponent.toArray();
			expect(simpleCompRefs.length).toEqual(2);
			expect(simpleCompRefs[0].value).toEqual('#1');
			expect(simpleCompRefs[1].value).toEqual('#2');
		});

		it ('should get all content children - with descendants', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let simpleComponentWithDescendants = compInstance.compRef.simpleComponentWithDescendants.toArray();
			expect(simpleComponentWithDescendants.length).toEqual(3);
			expect(simpleComponentWithDescendants[0].value).toEqual('#1');
			expect(simpleComponentWithDescendants[1].value).toEqual('#2');
			expect(simpleComponentWithDescendants[2].value).toEqual('#3');
		});

	});

	describe ('QueryList changes -', () => {

		@Component({
			selector: 'test',
			template: `

				<content-children>

					<simple *ngIf="flag"
							[value]="'#1'" >#1</simple>

					<simple *ngIf="!flag"
							[value]="'#2'" >#2</simple>

				</content-children>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRef: ContentChildrenComponent;

			flag: boolean = false;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ContentChildrenComponent,
					TestComponent
				]
			});
		});

		it ('should be possible to observe changes made to content', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			let simpleCompRefs: Array<SimpleComponent> = [];

			// when
			fixture.detectChanges();
			compInstance.compRef.simpleComponent.changes.subscribe(() => {
				simpleCompRefs = compInstance.compRef.simpleComponent.toArray();
			});
			compInstance.flag = true;
			fixture.detectChanges();

			// then
			expect(simpleCompRefs.length).toEqual(1);
			expect(simpleCompRefs[0].value).toEqual('#1');
		});
	});

});
