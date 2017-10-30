import {
	ApplicationRef, ChangeDetectorRef, Component, Directive, ElementRef, Injector, Renderer2, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Dependency Injection -', () => {

	describe('Component -', () => {

		@Component({
			selector: 'di-component',
			template: `

				<ng-template></ng-template>
			`
		})
		class InjectComponent {

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public parentInjector: Injector,
				public renderer: Renderer2,
				public changeDetectionRef: ChangeDetectorRef) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InjectComponent
					]
				});
		});


		it ('should have all native services injected', () => {

			// given
			const fixture = TestBed.createComponent(InjectComponent),
				compInstance = fixture.componentInstance;

			// when & then
			expect(compInstance.applicationRef).toBeDefined();
			expect(compInstance.elementRef).toBeDefined();
			expect(compInstance.viewContainerRef).toBeDefined();
			expect(compInstance.injector).toBeDefined();
			expect(compInstance.parentInjector).toBeDefined();
			expect(compInstance.renderer).toBeDefined();
			expect(compInstance.changeDetectionRef).toBeDefined();
		});

	});

	describe('Directive -', () => {

		@Directive({
			selector: '[di-directive]',
			exportAs: 'dirRef'
		})
		class InjectDirective {

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public parentInjector: Injector,
				public renderer: Renderer2,
				public changeDetectionRef: ChangeDetectorRef) {}

			methodOnDirective() {}
		}

		@Component({
			selector: 'test-di-directive',
			template: `
				<div di-directive #dirRef="dirRef" >
				</div>
			`
		})
		class TestInjectDirectiveComponent {
			@ViewChild('dirRef')
			dirRef: InjectDirective;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InjectDirective,
						TestInjectDirectiveComponent
					]
				});
		});

		it ('should have all native services injected', () => {

			// given
			const fixture = TestBed.createComponent(TestInjectDirectiveComponent),
				testCompInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(testCompInstance.dirRef.applicationRef).toBeDefined();
			expect(testCompInstance.dirRef.elementRef).toBeDefined();
			expect(testCompInstance.dirRef.viewContainerRef).toBeDefined();
			expect(testCompInstance.dirRef.injector).toBeDefined();
			expect(testCompInstance.dirRef.parentInjector).toBeDefined();
			expect(testCompInstance.dirRef.changeDetectionRef).toBeDefined();
			expect(testCompInstance.dirRef.renderer).toBeDefined();
			expect(testCompInstance.dirRef.methodOnDirective).toBeDefined();
		});

	});

	describe('ViewChild -', () => {

		@Component({
			selector: 'di-component',
			template: `

				<p #elementRef ></p>
				
				<ng-template #templateRef ></ng-template>
				
				<ng-container #containerRef ></ng-container>
				
				<di-blank #compRef ></di-blank>
			`
		})
		class ViewChildComponent {

			/**
			 * HTML tag - reference
			 */
			@ViewChild('elementRef')
			elementRef: ElementRef;

			@ViewChild('elementRef', { read: TemplateRef })
			elementRefAsTempRef: TemplateRef<any>;

			@ViewChild('elementRef', { read: ViewContainerRef })
			elementRefAsVcr: ViewContainerRef;

			@ViewChild('elementRef', { read: BlankComponent })
			elementRefAsBlankComponent: BlankComponent;


			/**
			 * <ng-template> - reference
			 */
			@ViewChild('templateRef')
			templateRef: TemplateRef<any>;

			@ViewChild('templateRef', { read: ElementRef })
			templateRefAsElemRef: ElementRef;

			@ViewChild('templateRef', { read: ViewContainerRef })
			templateRefAsVcr: ViewContainerRef;

			@ViewChild('templateRef', { read: BlankComponent })
			templateRefAsBlankComponent: BlankComponent;


			/**
			 * <ng-container> - reference
			 */
			@ViewChild('containerRef')
			containerRef: ElementRef;

			@ViewChild('containerRef', { read: TemplateRef })
			containerRefAsTempRef: TemplateRef<any>;

			@ViewChild('containerRef', { read: ViewContainerRef })
			containerRefAsVcr: ViewContainerRef;

			@ViewChild('containerRef', { read: BlankComponent })
			viewContainerRefAsBlankComponent: BlankComponent;


			/**
			 * Component template - reference
			 */
			@ViewChild('compRef')
			compRef: BlankComponent;

			@ViewChild('compRef', { read: ElementRef })
			compRefAsElemRef: ElementRef;

			@ViewChild('compRef', { read: TemplateRef })
			compRefAsTemplateRef: TemplateRef<any>;

			@ViewChild('compRef', { read: ViewContainerRef })
			compRefAsVcr: ViewContainerRef;

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




	});

});

/**
 * Checks if argument is of ViewContainerRef type
 *
 * @param vcr
 * @returns {boolean}
 */
function isViewContainerRef(vcr: ViewContainerRef): boolean {

	if (vcr.element &&
		vcr.injector &&
		vcr.parentInjector &&
		vcr.createEmbeddedView) {
		return true;
	}

	return false;
}

@Component({
	selector: 'di-blank',
	template: 'blank'
})
class BlankComponent {}
