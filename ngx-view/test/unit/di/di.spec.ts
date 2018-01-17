import {
	ApplicationRef, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, Directive, ElementRef, Host, Inject, Injectable, InjectionToken, Injector,
	NgModuleRef,
	NgZone,
	Optional,
	Renderer2,
	RendererFactory2,
	Self,
	SkipSelf,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

describe('Dependency Injection -', () => {

	describe('Component -', () => {

		@Component({
			selector: 'di-component',
			template: `

				<ng-template></ng-template>
			`
		})
		class InjectComponent {

			constructor(public applicationRef: ApplicationRef,
						public elementRef: ElementRef,
						public viewContainerRef: ViewContainerRef,
						public injector: Injector,
						public renderer: Renderer2,
						public rendererFactory: RendererFactory2,
						public componentFactoryResolver: ComponentFactoryResolver,
						public changeDetectionRef: ChangeDetectorRef,
						public compiler: Compiler,
						public ngModuleRef: NgModuleRef<any>,
						public ngZone: NgZone) {
			}
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


		it('should have all native services injected', () => {

			// given
			const fixture = TestBed.createComponent(InjectComponent),
				compInstance = fixture.componentInstance;

			// when & then
			expect(compInstance.applicationRef).toBeDefined();
			expect(compInstance.elementRef).toBeDefined();
			expect(compInstance.viewContainerRef).toBeDefined();
			expect(compInstance.injector).toBeDefined();
			expect(compInstance.renderer).toBeDefined();
			expect(compInstance.rendererFactory).toBeDefined();
			expect(compInstance.componentFactoryResolver).toBeDefined();
			expect(compInstance.changeDetectionRef).toBeDefined();
			expect(compInstance.compiler).toBeDefined();
			expect(compInstance.ngModuleRef).toBeDefined();
			expect(compInstance.ngZone).toBeDefined();
		});

	});

	describe('Directive -', () => {

		@Directive({
			selector: '[di-directive]',
			exportAs: 'dirRef'
		})
		class InjectDirective {

			constructor(public applicationRef: ApplicationRef,
						public elementRef: ElementRef,
						public viewContainerRef: ViewContainerRef,
						public injector: Injector,
						public renderer: Renderer2,
						public rendererFactory: RendererFactory2,
						public componentFactoryResolver: ComponentFactoryResolver,
						public changeDetectionRef: ChangeDetectorRef,
						public compiler: Compiler,
						public ngModuleRef: NgModuleRef<any>,
						public ngZone: NgZone) {
			}

			methodOnDirective() {
			}
		}

		@Component({
			selector: 'test-di-directive',
			template: `
				<div di-directive #dirRef="dirRef">
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

		it('should have all native services injected', () => {

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
			expect(testCompInstance.dirRef.changeDetectionRef).toBeDefined();
			expect(testCompInstance.dirRef.renderer).toBeDefined();
			expect(testCompInstance.dirRef.rendererFactory).toBeDefined();
			expect(testCompInstance.dirRef.componentFactoryResolver).toBeDefined();
			expect(testCompInstance.dirRef.compiler).toBeDefined();
			expect(testCompInstance.dirRef.ngModuleRef).toBeDefined();
			expect(testCompInstance.dirRef.ngZone).toBeDefined();
			expect(testCompInstance.dirRef.methodOnDirective).toBeDefined();
		});

	});

	describe('Service -', () => {

		@Injectable()
		class InjectService {

			constructor(public applicationRef: ApplicationRef,
						public injector: Injector,
						public rendererFactory: RendererFactory2,
						public componentFactoryResolver: ComponentFactoryResolver,
						public compiler: Compiler,
						public ngModuleRef: NgModuleRef<any>,
						public ngZone: NgZone) {
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					providers: [
						InjectService
					]
				});
		});


		it('should have all native services injected',
			inject([InjectService], (injectService: InjectService) => {

				// when & then
				expect(injectService.applicationRef).toBeDefined();
				expect(injectService.injector).toBeDefined();
				expect(injectService.rendererFactory).toBeDefined();
				expect(injectService.componentFactoryResolver).toBeDefined();
				expect(injectService.compiler).toBeDefined();
				expect(injectService.ngModuleRef).toBeDefined();
				expect(injectService.ngZone).toBeDefined();
			}));

	});

});
