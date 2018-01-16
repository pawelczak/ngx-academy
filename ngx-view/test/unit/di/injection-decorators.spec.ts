import { Component, Inject, Injectable, InjectionToken, Optional, Self, SkipSelf, Host, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('injection decorators -', () => {

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

		/**
		 * M - module context
		 * |
		 * P - parent context
		 * |
		 * C - component context
		 *
		 * In this case first parent of component is parentComponent.
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

		it ('should not take provider from module context', () => {

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
			expect(compInstance.selfService).toBeNull();
			expect(compInstance.notSelfService).not.toBeNull();
			expect(compInstance.notSelfService.value).toBe('Module context');
		});

	});

	/**
	 * @Host makes component to use providers only from component or parent component.
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
