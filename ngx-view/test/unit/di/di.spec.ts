import {
	ApplicationRef, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, ElementRef, Host, Injectable, Injector, Optional, Renderer2,
	RendererFactory2,
	Self,
	SkipSelf,
	TemplateRef, ViewChild,
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

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public parentInjector: Injector,
				public renderer: Renderer2,
				public rendererFactory: RendererFactory2,
				public componentFactoryResolver: ComponentFactoryResolver,
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
			expect(compInstance.rendererFactory).toBeDefined();
			expect(compInstance.componentFactoryResolver).toBeDefined();
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
				public rendererFactory: RendererFactory2,
				public componentFactoryResolver: ComponentFactoryResolver,
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
			expect(testCompInstance.dirRef.rendererFactory).toBeDefined();
			expect(testCompInstance.dirRef.componentFactoryResolver).toBeDefined();
			expect(testCompInstance.dirRef.methodOnDirective).toBeDefined();
		});

	});

	describe('Service -', () => {

		@Injectable()
		class InjectService {

			constructor(
				public applicationRef: ApplicationRef,
				public injector: Injector,
				public parentInjector: Injector,
				public rendererFactory: RendererFactory2,
				public componentFactoryResolver: ComponentFactoryResolver) {}
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


		it ('should have all native services injected',
			inject([InjectService], (injectService: InjectService) => {

			// when & then
			expect(injectService.applicationRef).toBeDefined();
			expect(injectService.injector).toBeDefined();
			expect(injectService.parentInjector).toBeDefined();
			expect(injectService.rendererFactory).toBeDefined();
			expect(injectService.componentFactoryResolver).toBeDefined();
		}));

	});

	describe('injection decorators -', () => {

		@Injectable()
		class Service {
			value: string;
		}

		describe('@Optional() -', () => {

			@Component({
				selector: 'di-comp',
				template: ``
			})
			class OptionalComponent {

				constructor(@Optional() public service: Service) {}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							OptionalComponent
						],
						providers: []
					});
			});

			it ('should not throw errors, despite not having service defined in providers', () => {

				// given
				const fixture = TestBed.createComponent(OptionalComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.service).toBeNull();
			});

		});

		describe('@SkipSelf() -', () => {

			@Component({
				selector: 'skip',
				template: ``,
				providers: [{
					provide: Service,
					useValue: {
						value: 'Component context'
					}
				}]
			})
			class SkipComponent {
				constructor(@Optional() @SkipSelf() public service: Service) {}
			}

			it ('should start to search provider from parent context', () => {

				// given
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							SkipComponent
						],
						providers: [{
							provide: Service,
							useValue: {
								value: 'Module context'
							}
						}]
					});

				const fixture = TestBed.createComponent(SkipComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.service.value).toBe('Module context');
			});

			it ('should not use service from component context if module doesn\'t have it in context', () => {

				// given
				TestBed
					.resetTestingModule()
					.configureTestingModule({
						imports: [],
						declarations: [
							SkipComponent
						]
					});
				const fixture = TestBed.createComponent(SkipComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.service).toBeNull();
			});

			it ('should start from first parent component',() => {

				// given

				@Component({
					selector: '',
					template: `<skip></skip>`,
					providers: [{
						provide: Service,
						useValue: {
							value: 'Parent context'
						}
					}]
				})
				class ParentSkipComponent {
					@ViewChild(SkipComponent)
					skipCompRef: SkipComponent;
				}

				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							ParentSkipComponent,
							SkipComponent
						],
						providers: [{
							provide: Service,
							useValue: {
								value: 'Module context'
							}
						}]
					});

				const fixture = TestBed.createComponent(ParentSkipComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.skipCompRef.service.value).toBe('Parent context');

			});

		});

		/**
		 * @Self makes component to use providers only from component declaration
		 */
		describe('@Self() -', () => {

			@Component({
				selector: 'self',
				template: ``,
				providers: []
			})
			class SelfComponent {
				constructor(@Optional() @Self() public service: Service) {
				}
			}

			it ('should not take provider from module context', () => {

				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							SelfComponent
						],
						providers: [{
							provide: Service,
							useValue: {
								value: 'Module context'
							}
						}]
					});

				// given
				const fixture = TestBed.createComponent(SelfComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.service).toBeNull();
			});

		});

		/**
		 * @Host makes component to use providers only from component or parent component
		 */
		describe('@Host() -', () => {

			@Component({
				selector: 'host',
				template: ``,
				providers: [{
					provide: Service,
					useValue: {
						value: 'Component context'
					}
				}]
			})
			class HostComponent {
				constructor(@Optional() @Host() public service: Service) {}
			}

			@Component({
				selector: '',
				template: `<host></host>`,
				providers: [{
					provide: Service,
					useValue: {
						value: 'Parent context'
					}
				}]
			})
			class ParentHostComponent {
				@ViewChild(HostComponent)
				hostComp: HostComponent;
			}

			it ('should not use provider declared in component', () => {

				// given
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HostComponent
						],
						providers: []
					});

				const fixture = TestBed.createComponent(HostComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.service.value).toBe('Component context');
			});

			it ('should use provider declared in parent component', () => {

				// given
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HostComponent,
							ParentHostComponent
						],
						providers: []
					});

				const fixture = TestBed.createComponent(ParentHostComponent),
					compInstance = fixture.componentInstance;

				// when & then
				expect(compInstance.hostComp.service.value).toBe('Component context');
			});

			it ('should not use provider declared in module', () => {

				@Component({
					selector: 'host',
					template: ``
				})
				class EmptyHostComponent {
					constructor(@Optional() @Host() public service: Service) {}
				}

				@Component({
					selector: '',
					template: `<host></host>`
				})
				class ParentEmptyHostComponent {
					@ViewChild(EmptyHostComponent)
					hostComp: HostComponent;
				}

				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							EmptyHostComponent,
							ParentEmptyHostComponent
						],
						providers: [{
							provide: Service,
							useValue: {
								value: 'Module context'
							}
						}]
					});

				// given
				const fixture = TestBed.createComponent(ParentEmptyHostComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
				expect(compInstance.hostComp.service).toBeNull();
			});

		});
	});

});
