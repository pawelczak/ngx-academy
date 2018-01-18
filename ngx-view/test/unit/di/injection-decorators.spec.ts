import { Component, Inject, Injectable, InjectionToken, Optional, Self, SkipSelf, Host, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Injection decorators -', () => {

	@Injectable()
	class Service {
		value: string;
	}

	describe('@Inject() -', () => {

		const injectionToken = new InjectionToken('token.service');

		@Component({
			selector: 'di-comp',
			template: ``
		})
		class InjectComponent {
			constructor(
				@Inject(Service) public service: Service,
				@Inject(injectionToken) public serviceFromToken: Service) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InjectComponent
					],
					providers: [
						Service,
						{
							provide: injectionToken,
							useClass: Service
						}
					]
				});
		});

		it ('should be possible to inject objects from context', () => {

			// given
			const fixture = TestBed.createComponent(InjectComponent),
				compInstance = fixture.componentInstance;

			// when & then
			expect(compInstance.service).toBeDefined();
			expect(compInstance.service instanceof Service).toBe(true);
			expect(compInstance.serviceFromToken).toBeDefined();
			expect(compInstance.serviceFromToken instanceof Service).toBe(true);
		});
	});


	/**
	 * @Optional decorators sets required dependency to null,
	 * when it is not provided in the components context.
	 */
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

	/**
	 * @SkipSelf tells injector to start looking for dependency from the parent injector.
	 * It means that injector doesn't look for dependency in component context.
	 */
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

		/**
		 * M - module context
		 * |
		 * P - parent context
		 * |
		 * C - component context
		 *
		 * In this case the first parent of component is parentComponent.
		 */
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
	 * @Self makes component to use providers only from component declaration.
	 */
	describe('@Self() -', () => {

		@Component({
			selector: 'self',
			template: ``,
			providers: []
		})
		class SelfComponent {
			constructor(@Optional() @Self() public selfService: Service,
						@Optional() public notSelfService: Service) {
			}
		}

		it ('should not take provider from module context', () => {

			// given
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


			const fixture = TestBed.createComponent(SelfComponent),
				compInstance = fixture.componentInstance;

			// when & then
			expect(compInstance.selfService).toBeNull();
			expect(compInstance.notSelfService).toBeDefined();
			expect(compInstance.notSelfService.value).toBe('Module context');
		});

	});

	/**
	 * @Host - Specifies that an injector should retrieve a dependency from any injector
	 * until reaching the host element of the current component.
	 * The @Host decorator stops the upward search at the host component.
	 * The host component is typically the component requesting the dependency,
	 * but when this component is projected into a parent component,
	 * that parent component becomes the host.
	 *
	 * M - module context
	 * |
	 * P - parent context
	 * |
	 * C - component context
	 */
	describe('@Host() -', () => {

		@Injectable()
		class OtherService {
			value: string;
		}

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
			constructor(@Optional() @Host() public service: Service,
		 				@Optional() @Host() public otherService: OtherService) {}
		}

		@Component({
			selector: 'parent-host',
			template: `<host></host>`,
			providers: [{
				provide: Service,
				useValue: {
					value: 'Parent context'
				}
			},
			{
				provide: OtherService,
				useValue: {
					value: 'Parent context'
				}
			}]
		})
		class ParentComponent {
			@ViewChild(HostComponent)
			hostCompRef: HostComponent;
		}

		/**
		 * In this scenario ParentComponent uses HostComponent. It may seem,
		 * that in this case 'host component' is ParentComponent, but actually it's not.
		 * HostComponent is the 'host component', so services marked with @Host()
		 * will be taken just from context of HostComponent.
		 */
		it ('should use provider declared in the context of created component', () => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						HostComponent,
						ParentComponent
					]
				});

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.hostCompRef.service.value).toBe('Component context');
			expect(compInstance.hostCompRef.otherService).toBeNull();
		});

		/**
		 * When component is projected, @Host() annotation says that component
		 * should use parents injector of component that wraps current component.
		 *
		 * <parent-host>
		 *     <host></host>
		 * </parent-host>
		 *
		 * HostComponent is projected, because it is declaren in the content of another component,
		 * so objects marked with @Host() will be injected from ParentComponent.
		 *
		 * If requested object doesn't live in the ParentComponents context, it will not be taken
		 * from higher level components.
		 *
		 */
		it ('should use provider declared in parent component', () => {

			// given
			@Component({
				selector: 'test',
				template: `
					<parent-host>
						<host></host>
					</parent-host>
				`
			})
			class TestComponent {
				@ViewChild(HostComponent)
				hostCompRef: HostComponent;
			}

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						HostComponent,
						ParentComponent,
						TestComponent
					],
					providers: []
				});

			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.hostCompRef.service.value).toBe('Component context', 'Service');
			expect(compInstance.hostCompRef.otherService.value).toBe('Parent context', 'OtherService');
		});

		/**
		 * @Host() stops looking for a provided object on 'host component'.
		 * That means it will not take
		 */
		it ('should not use provider declared in module', () => {

			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						HostComponent,
						ParentComponent
					],
					providers: [{
						provide: Service,
						useValue: {
							value: 'Module context'
						}
					},
					{
						provide: OtherService,
						useValue: {
							value: 'Module context'
						}
					}]
				});

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.hostCompRef.service.value).toBe('Component context');
			expect(compInstance.hostCompRef.otherService).toBeNull();
		});
	});

});
