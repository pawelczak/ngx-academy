import {
	Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BlankComponent } from '../helpers/blank.component';
import { isViewContainerRef } from '../helpers/matchers';


describe('ViewChild -', () => {

	describe('template references -', () => {

		@Component({
			selector: 'di-component',
			template: `
	
				<p #elementRef ></p>
	
				<ng-template #templateRef ></ng-template>
	
				<ng-container #containerRef ></ng-container>
	
				<blank #compRef ></blank>
			`
		})
		class ViewChildComponent {

			/**
			 * HTML tag - reference
			 */
			@ViewChild('elementRef', { static: true })
			elementRef: ElementRef;

			@ViewChild('elementRef', { read: TemplateRef, static: true })
			elementRefAsTempRef: TemplateRef<any>;

			@ViewChild('elementRef', { read: ViewContainerRef, static: true })
			elementRefAsVcr: ViewContainerRef;

			@ViewChild('elementRef', { read: BlankComponent, static: true })
			elementRefAsBlankComponent: BlankComponent;


			/**
			 * <ng-template> - reference
			 */
			@ViewChild('templateRef', { static: true })
			templateRef: TemplateRef<any>;

			@ViewChild('templateRef', { read: ElementRef, static: true })
			templateRefAsElemRef: ElementRef;

			@ViewChild('templateRef', { read: ViewContainerRef, static: true })
			templateRefAsVcr: ViewContainerRef;

			@ViewChild('templateRef', { read: BlankComponent, static: true })
			templateRefAsBlankComponent: BlankComponent;


			/**
			 * <ng-container> - reference
			 */
			@ViewChild('containerRef', { static: true })
			containerRef: ElementRef;

			@ViewChild('containerRef', { read: TemplateRef, static: true })
			containerRefAsTempRef: TemplateRef<any>;

			@ViewChild('containerRef', { read: ViewContainerRef, static: true })
			containerRefAsVcr: ViewContainerRef;

			@ViewChild('containerRef', { read: BlankComponent, static: true })
			viewContainerRefAsBlankComponent: BlankComponent;


			/**
			 * Component template - reference
			 */
			@ViewChild('compRef', { static: true })
			compRef: BlankComponent;

			@ViewChild('compRef', { read: ElementRef, static: true })
			compRefAsElemRef: ElementRef;

			@ViewChild('compRef', { read: TemplateRef, static: true })
			compRefAsTemplateRef: TemplateRef<any>;

			@ViewChild('compRef', { read: ViewContainerRef, static: true })
			compRefAsVcr: ViewContainerRef;

			@ViewChild('p', { static: true })
			pTag: ElementRef;

		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ViewChildComponent,
						BlankComponent
					]
				});
		});


		it ('should have reference to HTML tag element', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.elementRef instanceof ElementRef).toBe(true, 'html tag as ElementRef'); // TRUE
			expect(compInstance.elementRefAsTempRef instanceof TemplateRef).toBe(false, 'html tag as TemplateRef'); // FALSE
			expect(isViewContainerRef(compInstance.elementRefAsVcr)).toBe(true, 'html tag as ViewContainerRef'); // TRUE
			expect(compInstance.elementRefAsBlankComponent instanceof BlankComponent).toBe(false, 'html tag as ComponentRef'); // FALSE
		});

		it ('should have reference to "<ng-template>" element', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.templateRefAsElemRef instanceof ElementRef).toBe(true, 'ng-template templateRef as ElementRef'); // TRUE
			expect(compInstance.templateRef instanceof TemplateRef).toBe(true, 'ng-template templateRef as TemplateRef'); // TRUE
			expect(isViewContainerRef(compInstance.templateRefAsVcr)).toBe(true, 'ng-template templateRef as ViewContainerRef'); // TRUE
			expect(compInstance.templateRefAsBlankComponent instanceof BlankComponent).toBe(false, 'ng-template templateRef as BlankComponent'); // FALSE
		});

		it ('should have reference to "<ng-container>" element', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.containerRef instanceof ElementRef).toBe(true, 'ng-container templateRef as ElementRef'); // TRUE
			expect(compInstance.containerRefAsTempRef instanceof TemplateRef).toBe(false, 'ng-container templateRef as TemplateRef'); // FALSE
			expect(isViewContainerRef(compInstance.containerRefAsVcr)).toBe(true, 'ng-container templateRef as ViewContainerRef'); // TRUE
			expect(compInstance.viewContainerRefAsBlankComponent instanceof BlankComponent).toBe(false, 'ng-container templateRef as BlankComponent'); // FALSE
		});

		it ('should have reference to component element', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.compRef instanceof BlankComponent).toBe(true, 'componentRef as BlankComponent'); // TRUE
			expect(compInstance.compRefAsElemRef instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE
			expect(compInstance.compRefAsTemplateRef instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // FALSE
			expect(isViewContainerRef(compInstance.compRefAsVcr)).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		it ('is not possible to get reference to element by html tag', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.pTag).not.toBeDefined('element by tag selector');
		})

	});

	describe('component reference -', () => {

		@Component({
			selector: 'comp-ref',
			template: `
			<comp-val #compVal ></comp-val>
			`
		})
		class CompRefComponent {
			@ViewChild('compVal', { static: true })
			compWithVal: CompWithValueComponent;
		}

		@Component({
			selector: 'comp-val',
			template: `
			`
		})
		class CompWithValueComponent {
			value: string;

			ngAfterViewInit() {
				this.value = 'ready';
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						CompRefComponent,
						CompWithValueComponent
					]
				});
		});


		it ('should be ready on NgAfterViewInit', () => {

			// given
			const fixture = TestBed.createComponent(CompRefComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.compWithVal.value).toEqual('ready');
		});
	});

});
