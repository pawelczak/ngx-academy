import {
	Component, Directive, ElementRef, Input, QueryList, TemplateRef, ViewChildren, ViewContainerRef
} from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { isViewContainerRef } from '../helpers/matchers';


describe('ViewChildren -', () => {

	@Component({
		selector: 'simple',
		template: ``
	})
	class SimpleComponent {
		@Input()
		value: string;
	}

	/**
	 * @ViewChildren variables are initialized after the lifecycle hook 'AfterViewInit' is invoked.
	 */
	describe('ngAfterViewInit -', () => {

		@Component({
			selector: 'test',
			template: `

				<simple [value]="'#1'" >#1</simple>
				<simple [value]="'#2'" >#2</simple>
				<simple [value]="'#3'" >#3</simple>

			`
		})
		class TestComponent {
			@ViewChildren(SimpleComponent)
			compRefs: QueryList<SimpleComponent>;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					TestComponent
				]
			});
		});


		/**
		 * Before the AfterViewInit lifecycle hook occurs
		 * @ViewChildren variables are undefined
		 */
		it ('should accessible after AfterViewInit lifecycle', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			/**
			 * Before AfterViewInit
			 */
			expect(fixture.componentInstance.compRefs).toBeUndefined();

			/**
			 * Run all lifecycle hooks
			 */
			fixture.detectChanges();

			/**
			 * After AfterViewInit
			 */
			expect(fixture.componentInstance.compRefs).toBeDefined();
		});

		it ('should be possible to get component instance(with inputs) from QueryList', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			const simpleCompRefs = compInstance.compRefs.toArray();
			expect(simpleCompRefs.length).toEqual(3);
			expect(simpleCompRefs[0].value).toEqual('#1');
			expect(simpleCompRefs[1].value).toEqual('#2');
			expect(simpleCompRefs[2].value).toEqual('#3');
		});

	});

	/**
	 * @ViewChildren allows to get different types when referencing a component
	 */
	describe ('read component -', () => {

		@Component({
			selector: 'test',
			template: `

				<simple #compOne [value]="'#1'" >
				</simple>

				<simple #compTwo [value]="'#2'" >
				</simple>
			`
		})
		class TestComponent {

			/**
			 * component references
			 */
			@ViewChildren(SimpleComponent)
			compRefs: QueryList<SimpleComponent>;

			/**
			 * component references as ElementRefs
			 */
			@ViewChildren(SimpleComponent, {read: ElementRef})
			compAsElementRefs: QueryList<ElementRef>;

			/**
			 * component references as ElementRefs
			 */
			@ViewChildren(SimpleComponent, {read: TemplateRef})
			compAsTempRefs: QueryList<TemplateRef<any>>;

			/**
			 * component references as ViewContainerRef
			 */
			@ViewChildren(SimpleComponent, {read: ViewContainerRef})
			compAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * component references by template variable
			 */
			@ViewChildren('compOne')
			compByTemplVarRefs: QueryList<SimpleComponent>;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
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
			let compRefs = compInstance.compRefs.toArray();
			expect(compRefs.length).toEqual(2);
			expect(compRefs[0] instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE
			expect(compRefs[0].value).toEqual('#1');
			expect(compRefs[1].value).toEqual('#2');

			let compAsElemRefs = compInstance.compAsElementRefs.toArray();
			expect(compAsElemRefs.length).toEqual(2);
			expect(compAsElemRefs[0] instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			let compAsTempRefs = compInstance.compAsTempRefs.toArray();
			expect(compAsTempRefs.length).toEqual(2);
			expect(compAsTempRefs[0] instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // FALSE

			let compAsVcrs = compInstance.compAsVcrs.toArray();
			expect(compAsVcrs.length).toEqual(2);
			expect(isViewContainerRef(compAsVcrs[0])).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ViewChildren allows to get reference to a component by template variable
		 */
		it ('should be possible to get reference by template variable', () => {
			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let compByTemplVarRefs = compInstance.compByTemplVarRefs.toArray();
			expect(compByTemplVarRefs.length).toEqual(1);
			expect(compByTemplVarRefs[0].value).toEqual('#1');
			expect(compByTemplVarRefs[0] instanceof SimpleComponent).toBe(true, 'componentRef as componentRef'); // TRUE
		});

	});

	/**
	 * @ViewChildren allows to get reference to multiple instances of directives
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
			selector: 'test',
			template: `

				<p #dirOne="propDir" [propDir]="'#1'" ></p>
				<p #dirTwo="propDir" [propDir]="'#2'" ></p>
				<p #dirThree="propDir" [propDir]="'#3'" ></p>

			`
		})
		class TestComponent {

			/**
			 * directive references
			 */
			@ViewChildren(PropDirective)
			dirRefs: QueryList<PropDirective>;

			/**
			 * directive references as ElementRefs
			 */
			@ViewChildren(SimpleComponent, {read: ElementRef})
			dirAsElementRefs: QueryList<ElementRef>;

			/**
			 * directive references as ElementRefs
			 */
			@ViewChildren(SimpleComponent, {read: TemplateRef})
			dirAsTempRefs: QueryList<TemplateRef<any>>;

			/**
			 * directive references as ViewContainerRef
			 */
			@ViewChildren(SimpleComponent, {read: ViewContainerRef})
			dirAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * directive references by template variable
			 */
			@ViewChildren('dirOne')
			dirByTemplVarRefs: QueryList<SimpleComponent>;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					PropDirective,
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
			let propDirectivesRefs = compInstance.dirRefs.toArray();

			expect(propDirectivesRefs.length).toEqual(3);
			expect(propDirectivesRefs[0].value).toEqual('#1');
			expect(propDirectivesRefs[1].value).toEqual('#2');
			expect(propDirectivesRefs[2].value).toEqual('#3');
			expect(propDirectivesRefs[0] instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE
		});

		/**
		 * When you want to get reference to a directive by @ViewChildren, you cannot use read option. It doesn't work.
		 */
		it ('shouldn\'t be possible to use read parameter with directive', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let dirAsElementRefs = compInstance.dirAsElementRefs.toArray();
			expect(dirAsElementRefs.length).toEqual(0);
			expect(dirAsElementRefs[0] instanceof ElementRef).toBe(false, 'directiveRef as ElementRef'); // FALSE

			let dirAsTempRefs = compInstance.dirAsTempRefs.toArray();
			expect(dirAsTempRefs.length).toEqual(0);
			expect(dirAsTempRefs[0] instanceof TemplateRef).toBe(false, 'directiveRef as TemplateRef'); // FALSE

			let dirAsVcrs = compInstance.dirAsVcrs.toArray();
			expect(dirAsVcrs.length).toEqual(0);
			expect(isViewContainerRef(dirAsVcrs[0])).toBe(false, 'directiveRef as ViewContainerRef'); // FALSE
		});

		/**
		 * @ViewChildren allows to get reference to a directive by template variable
		 */
		it ('should be possible to get reference by template variable', () => {
			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let dirByTemplVarRefs = compInstance.dirByTemplVarRefs.toArray();
			expect(dirByTemplVarRefs.length).toEqual(1);
			expect(dirByTemplVarRefs[0].value).toEqual('#1');
			expect(dirByTemplVarRefs[0] instanceof PropDirective).toBe(true, 'directiveRef as directiveRef'); // TRUE
		});

	});

	/**
	 * @ViewChildren allows to get different types when referencing a template
	 */
	describe ('read ng-template -', () => {

		@Component({
			selector: 'test',
			template: `
				
				<ng-template #templOne >
				</ng-template>

				<ng-template #templTwo >
				</ng-template>

			`
		})
		class TestComponent {
			/**
			 * ng-template references
			 */
			@ViewChildren(TemplateRef)
			templRefs: QueryList<TemplateRef<any>>;

			/**
			 * ng-template references as ElementRefs
			 */
			@ViewChildren(TemplateRef, {read: ElementRef})
			templAsElementRefs: QueryList<ElementRef>;

			/**
			 * ng-template references as ComponentRefs
			 */
			@ViewChildren(TemplateRef, {read: SimpleComponent})
			templAsCompRefs: QueryList<SimpleComponent>;

			/**
			 * ng-template references as ViewContainerRef
			 */
			@ViewChildren(TemplateRef, {read: ViewContainerRef})
			templAsVcrs: QueryList<ViewContainerRef>;

			/**
			 * ng-template references by template variable
			 */
			@ViewChildren('templOne')
			templByTemplVarRefs: QueryList<SimpleComponent>;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
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
			let templRefs = compInstance.templRefs.toArray();
			expect(templRefs.length).toEqual(2);
			expect(templRefs[0] instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE

			let templAsElementRefs = compInstance.templAsElementRefs.toArray();
			expect(templAsElementRefs.length).toEqual(2);
			expect(templAsElementRefs[0] instanceof ElementRef).toBe(true, 'TemplateRef as ElementRef'); // TRUE

			let templAsCompRefs = compInstance.templAsCompRefs.toArray();
			expect(templAsCompRefs.length).toEqual(0);
			expect(templAsCompRefs[0] instanceof SimpleComponent).toBe(false, 'TemplateRef as SimpleComponent'); // FALSE

			let templAsVcrs = compInstance.templAsVcrs.toArray();
			expect(templAsVcrs.length).toEqual(2);
			expect(isViewContainerRef(templAsVcrs[0])).toBe(true, 'TemplateRef as ViewContainerRef'); // TRUE
		});

		/**
		 * @ViewChildren allows to get reference to a template by template variable
		 */
		it ('should be possible to get reference to a template by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let templByTemplVarRefs = compInstance.templByTemplVarRefs.toArray();
			expect(templByTemplVarRefs.length).toEqual(1);
			expect(templByTemplVarRefs[0] instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE
		})

	});

	/**
	 * @ViewChildren allows to get a reference by tag element
	 */
	describe ('HTML tag -', () => {

		@Component({
			selector: 'test',
			template: `

				<p>#1</p>
				<p>#2</p>
				<p>#3</p>
				
				<p #templVar >#4</p>

			`
		})
		class TestComponent {

			/**
			 * HTML tag references
			 */
			@ViewChildren('p')
			tagRefs: QueryList<any>;

			/**
			 * HTML tag references by template variable
			 */
			@ViewChildren('templVar')
			tagBytemplVarRefs: QueryList<ElementRef>;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					TestComponent
				]
			});
		});

		/**
		 * @ViewChildren doesn't allow to get reference by HTML tag
		 */
		it ('should not be possible to get reference by HTML tag', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			let templRefs = compInstance.tagRefs.toArray();
			expect(templRefs.length).toEqual(0);
			expect(templRefs[0]).toBeUndefined();
		});

		/**
		 * @ViewChildren allows to get reference to a HTML node by template variable
		 */
		it ('should be possible to get reference to a template by template variable', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			let templByTemplVarRefs = compInstance.tagBytemplVarRefs.toArray();
			expect(templByTemplVarRefs.length).toEqual(1);
			expect(templByTemplVarRefs[0] instanceof ElementRef).toBe(true, 'ElementRef as ElementRef'); // TRUE
		});

	});

	describe ('QueryList changes -', () => {

		@Component({
			selector: 'test',
			template: `

				<simple *ngIf="flag"
						[value]="'#1'" >#1</simple>

				<simple *ngIf="!flag"
						[value]="'#2'" >#2</simple>
			`
		})
		class TestComponent {

			/**
			 * component references
			 */
			@ViewChildren(SimpleComponent)
			simpleComponents: QueryList<SimpleComponent>;

			flag: boolean = false;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					TestComponent
				]
			});
		});

		/**
		 * There is some issue here.
		 * It seems, that changes from @ViewChildren are all detect changes cycles,
		 * when angular is stable. It is hard to test it.
		 */
		it ('should be possible to observe changes made to view', fakeAsync(() => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			let simpleCompRefs: Array<SimpleComponent> = [];

			// when
			fixture.detectChanges();
			compInstance.simpleComponents.changes.subscribe((s) => {
				simpleCompRefs = compInstance.simpleComponents.toArray();
			});

			fixture
				.whenStable()
				.then(() => {
					// then
					expect(simpleCompRefs.length).toEqual(1);
					expect(simpleCompRefs[0].value).toEqual('#1');
				});

			compInstance.flag = true;
			fixture.detectChanges();
		}));

	});

});
