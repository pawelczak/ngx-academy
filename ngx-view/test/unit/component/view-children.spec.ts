import {
	Component, Directive, ElementRef, Input, QueryList, TemplateRef, ViewChildren, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BlankComponent } from './helpers/blank.component';
import { isViewContainerRef } from './helpers/matchers';


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


	describe('template references -', () => {

		@Component({
			selector: 'view-children-component',
			template: `

				<p class="paragraph" >Lorem</p>
				<p class="paragraph" >ipsum</p>
				<p class="paragraph" >dolor</p>
				
				<blank></blank>
				<blank></blank>
				<blank></blank>
				
				<ng-template></ng-template>
				<ng-template></ng-template>
				<ng-template></ng-template>
				
			`
		})
		class ViewChildrenComponent {

			@ViewChildren(BlankComponent)
			blankComponents: QueryList<BlankComponent>;

			@ViewChildren(BlankComponent, { read: ElementRef })
			blankComponentsAsElemRef: QueryList<ElementRef>;

			@ViewChildren(BlankComponent, { read: TemplateRef })
			blankComponentsAsTempRef: QueryList<TemplateRef<any>>;

			@ViewChildren(BlankComponent, { read: ViewContainerRef })
			blankComponentsAsVcr: QueryList<ViewContainerRef>;

			@ViewChildren(TemplateRef)
			tempRefs: QueryList<TemplateRef<any>>;

			@ViewChildren('p')
			pElements: QueryList<ElementRef>;

		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ViewChildrenComponent,
						BlankComponent
					]
				});
		});

		it ('should be possible to get reference to ng-template', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.tempRefs.length).toEqual(3);
			expect(fixture.componentInstance.tempRefs.first instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE
		});

		it ('should be possible to get reference to components', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.blankComponents.length).toEqual(3);
			expect(fixture.componentInstance.blankComponents.first instanceof BlankComponent).toBe(true, 'componentRef as ComponentRef'); // TRUE

			expect(fixture.componentInstance.blankComponentsAsElemRef.length).toEqual(3);
			expect(fixture.componentInstance.blankComponentsAsElemRef.first instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			expect(fixture.componentInstance.blankComponentsAsTempRef.length).toEqual(3);
			expect(fixture.componentInstance.blankComponentsAsTempRef.first instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // FALSE

			expect(fixture.componentInstance.blankComponentsAsVcr.length).toEqual(3);
			expect(isViewContainerRef(fixture.componentInstance.blankComponentsAsVcr.first)).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		it ('not possible to get multiple element references by HTML tag selector', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.pElements.length).toEqual(0);
		});

	});

});
