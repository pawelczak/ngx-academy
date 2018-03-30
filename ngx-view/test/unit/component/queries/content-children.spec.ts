import {
	AfterContentInit,
	ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, InjectionToken, Input, QueryList, TemplateRef, ViewChild,
	ViewContainerRef
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { isViewContainerRef } from '../helpers/matchers';


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
					<simple [value]="'#1'">#1</simple>
					<simple [value]="'#2'">#2</simple>
					<simple [value]="'#3'">#3</simple>
				</content-children>

			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRefs: ContentChildrenComponent;
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
		it('should accessible after AfterContentInit lifecycle', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			/**
			 * Before AfterContentInit
			 */
			expect(fixture.componentInstance.compRefs.simpleComponent).toBeUndefined();

			/**
			 * Run all lifecycle hooks
			 */
			fixture.detectChanges();

			/**
			 * After AfterContentInit
			 */
			expect(fixture.componentInstance.compRefs.simpleComponent).toBeDefined();
		});

		it('should be possible to get component instance(with inputs) from QueryList', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			const simpleCompRefs = compInstance.compRefs.simpleComponent.toArray();
			expect(simpleCompRefs.length).toEqual(3);
			expect(simpleCompRefs[0].value).toEqual('#1');
			expect(simpleCompRefs[1].value).toEqual('#2');
			expect(simpleCompRefs[2].value).toEqual('#3');
		});

	});

	/**
	 * Every time angular creates a component it puts that object
	 * into the injector. Than created object can be used as a selector
	 * for the @ContentChildren.
	 */
	describe('selector -', () => {

		/**
		 * Possible view selectors:
		 * - Component
		 * - Directive
		 * - TemplateRef<any>
		 * - template variable
		 */
		describe('view -', () => {

			@Component({
				selector: 'selector-comp',
				template: ``
			})
			class SelectorComponent {
			}

			@Directive({
				selector: '[selector-dir]'
			})
			class SelectorDirective {
			}

			@Component({
				selector: 'content-children',
				template: ``
			})
			class ContentChildrenComponent {

				/**
				 * component as a selector
				 */
				@ContentChildren(SelectorComponent)
				compQL: QueryList<SimpleComponent>;

				/**
				 * directive as a selector
				 */
				@ContentChildren(SelectorDirective)
				dirQL: QueryList<SelectorDirective>;

				/**
				 * ng-template as a selector
				 */
				@ContentChildren(TemplateRef)
				templQL: QueryList<TemplateRef<any>>;

				/**
				 * template variable as a selector
				 */
				@ContentChildren('selector')
				templVariableQL: QueryList<SelectorDirective>;

				/**
				 * HTML tag as a selector (doesn't work)
				 */
				@ContentChildren('p')
				pTagQL: QueryList<ElementRef>;
			}

			@Component({
				template: `
					<content-children>

						<selector-comp selector-dir #selector></selector-comp>

						<selector-comp></selector-comp>

						<ng-template selector-dir #selector></ng-template>

						<ng-template></ng-template>

						<p></p>

					</content-children>
				`
			})
			class TestComponent {
				@ViewChild(ContentChildrenComponent)
				compRef: ContentChildrenComponent;
			}

			let compInstance: any;

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SelectorComponent,
						SelectorDirective,
						ContentChildrenComponent,
						TestComponent
					]
				});

				// given
				const fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();
			});

			it('is possible to use component as a selector', () => {

				// then
				const compRefs = compInstance.compRef.compQL.toArray();
				expect(compRefs.length).toBe(2);
				compRefs.forEach((comp: SelectorComponent) => {
					expect(comp instanceof SelectorComponent).toBe(true, 'SelectorComponent as a selector');
				});
			});

			it('is possible to use directive as a selector', () => {

				// then
				const dirRefs = compInstance.compRef.dirQL.toArray();
				expect(dirRefs.length).toBe(2);
				dirRefs.forEach((dir: SelectorDirective) => {
					expect(dir instanceof SelectorDirective).toBe(true, 'SelectorDirective as a selector');
				});
			});

			/**
			 * TemplateRef selector allows to get reference to a <ng-template>.
			 */
			it('is possible to use ng-template as a selector', () => {

				// then
				const templRefs = compInstance.compRef.templQL.toArray();
				expect(templRefs.length).toBe(2);
				templRefs.forEach((templRef: any) => {
					expect(templRef instanceof TemplateRef).toBe(true, 'TemplateRef as a selector');
				});
			});

			/**
			 * It should be noted that you can declare couple of template variables
			 * with the same name. This way you can get references to multiple
			 * components, like in the example below.
			 */
			it('is possible to use template variables as a selector', () => {

				// then
				const templVariableRefs = compInstance.compRef.templVariableQL.toArray();
				expect(templVariableRefs.length).toBe(2);
				expect(templVariableRefs[0] instanceof SelectorComponent).toBe(true, 'SelectorComponent as a selector');
				expect(templVariableRefs[1] instanceof TemplateRef).toBe(true, 'template variable as a selector');
			});

			/**
			 * Doesn't work
			 */
			it('isn\'t possible to use HTML tag as a selector', () => {

				// then
				const pTagRefs = compInstance.compRef.pTagQL.toArray();
				expect(pTagRefs.length).toBe(0);
			});
		});

		/**
		 * Providers provided in the component can be used as a selectors
		 * in the ContentChild query.
		 */
		describe('service -', () => {

			class SelectorService {
			}

			class SelectorValue {
			}

			const providedValue = 'Kobe Bryant',
				stringToken = 'magic string',
				injectionToken = new InjectionToken(stringToken);

			@Component({
				selector: 'selector-comp',
				template: ``,
				providers: [{
					provide: SelectorService,
					useExisting: SelectorComponent
				}, {
					provide: stringToken,
					useExisting: SelectorComponent
				}, {
					provide: injectionToken,
					useExisting: SelectorComponent
				}, {
					provide: SelectorValue,
					useValue: providedValue
				}]
			})
			class SelectorComponent {
			}

			@Component({
				selector: 'container',
				template: ``
			})
			class ContainerComponent {
				@ContentChildren(SelectorService)
				compQL: QueryList<SelectorComponent>;

				@ContentChildren(stringToken)
				compByStringQL: QueryList<SelectorComponent>;

				@ContentChildren(injectionToken as any)
				compByTokenQL: QueryList<SelectorComponent>;

				@ContentChildren(SelectorValue)
				valueQL: QueryList<any>;
			}

			@Component({
				template: `
					<container>
						<selector-comp></selector-comp>
						<selector-comp></selector-comp>
					</container>
				`
			})
			class TestComponent {
				@ViewChild(ContainerComponent)
				compRef: ContainerComponent;
			}

			let compInstance: any;

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SelectorComponent,
						ContainerComponent,
						TestComponent
					]
				});

				// given
				const fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();
			});

			it('should allow to select component by it\'s own service', () => {

				// then
				const compRefs = compInstance.compRef.compQL.toArray();
				expect(compRefs.length).toBe(2);
				compRefs.forEach((compRef: SelectorComponent) => {
					expect(compRef instanceof SelectorComponent).toBe(true, 'service as a selector');
				});
			});

			it('should allow to select component by string provider', () => {

				// then
				const compRefs = compInstance.compRef.compByStringQL.toArray();
				expect(compRefs.length).toBe(2);
				compRefs.forEach((compRef: SelectorComponent) => {
					expect(compRef instanceof SelectorComponent).toBe(true, 'service as a selector');
				});
			});

			it('should allow to select component by InjectionToken provider', () => {

				// then
				const compRefs = compInstance.compRef.compByTokenQL.toArray();
				expect(compRefs.length).toBe(2);
				compRefs.forEach((compRef: SelectorComponent) => {
					expect(compRef instanceof SelectorComponent).toBe(true, 'service as a selector');
				});
			});

			/**
			 * ContentChild can by use to retrieve any provided service / value
			 * from a components injector.
			 */
			it('should allow to select value from container injector', () => {

				// then
				const values = compInstance.compRef.valueQL.toArray();
				expect(values.length).toBe(2);
				values.forEach((value: any) => {
					expect(value).toBe(providedValue, 'useValue provider as a selector');
				});
			});
		});

		/**
		 * It's possible to get references to a couple of different type of components.
		 *
		 * <heroes>
		 *     <batman></batman>
		 *     <wolverine></wolverine>
		 * </heroes>
		 *
		 * To make it work, component needs to provide itself under an common alias,
		 * then this alias is used as a selector in the ContentChildren.
		 */
		describe('multiple types of components -', () => {

			class Hero {
			}

			@Component({
				selector: 'batman',
				template: ``,
				providers: [{
					provide: Hero, useExisting: BatmanComponent
				}]
			})
			class BatmanComponent {
			}

			@Component({
				selector: 'wolverine',
				template: ``,
				providers: [{
					provide: Hero, useExisting: WolverineComponent
				}]
			})
			class WolverineComponent {
			}

			@Component({
				selector: 'heroes',
				template: ``
			})
			class Heroes {
				@ContentChildren(Hero)
				heroesQL: QueryList<any>;
			}

			@Component({
				template: `
					<heroes>
						<batman></batman>
						<wolverine></wolverine>
					</heroes>
				`
			})
			class TestComponent {
				@ViewChild(Heroes)
				multiRef: Heroes;
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						declarations: [
							BatmanComponent,
							WolverineComponent,
							Heroes,
							TestComponent
						]
					});
			});

			it('should get reference to different components', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				const heroes = fixture.componentInstance.multiRef.heroesQL.toArray();

				expect(heroes.length).toBe(2);
				expect(heroes[0] instanceof BatmanComponent).toBeTruthy();
				expect(heroes[1] instanceof WolverineComponent).toBeTruthy();
			});
		});
	});

	/**
	 * ContentChildren allow to get any object from the selected components context.
	 * In order to use it you need to specify second argument in the query,
	 * which is 'read' e.g.
	 * @ContentChildren(SimpleComponent, {read: ElementRef})
	 * Argument read allows to get any object from the components injector.
	 */
	describe('read -', () => {

		class Service {
		}

		@Component({
			selector: 'read-comp',
			template: ``,
			providers: [
				Service
			]
		})
		class ReadComponent {
		}

		@Component({
			selector: 'content-children',
			template: ``
		})
		class ContentChildrenComponent {

			/**
			 * read default
			 */
			@ContentChildren(ReadComponent)
			compQL: QueryList<ReadComponent>;

			/**
			 * read service
			 */
			@ContentChildren(ReadComponent, {read: Service})
			serviceQL: QueryList<Service>;

			/**
			 * read native objects
			 */
			@ContentChildren(ReadComponent, {read: ElementRef})
			elRefQL: QueryList<Service>;
		}

		@Component({
			template: `
				<content-children>
					<read-comp></read-comp>
					<read-comp></read-comp>
				</content-children>
			`
		})
		class TestComponent {
			@ViewChild(ContentChildrenComponent)
			compRef: ContentChildrenComponent;
		}

		let compIntance: any;

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						ReadComponent,
						ContentChildrenComponent,
						TestComponent
					]
				});

			// given
			const fixture = TestBed.createComponent(TestComponent);
			compIntance = fixture.componentInstance;

			// when
			fixture.detectChanges();
		});


		it('should read selector component', () => {

			// then
			const compRefs = compIntance.compRef.compQL.toArray();

			expect(compRefs.length).toBe(2);
			compRefs.forEach((compRef: ReadComponent) => {
				expect(compRef instanceof ReadComponent).toBeTruthy();
			});
		});

		/**
		 * Read allows to get any object from injector context, even service
		 */
		it('should read service from components injector', () => {

			// then
			const services = compIntance.compRef.serviceQL.toArray();

			expect(services.length).toBe(2);
			services.forEach((service: Service) => {
				expect(service instanceof Service).toBeTruthy();
			});
		});

		/**
		 * Native objects like: ElementRef, ViewContainerRef, etc.
		 */
		it('should read native objects from components injector', () => {

			// then
			const elRefs = compIntance.compRef.elRefQL.toArray();

			expect(elRefs.length).toBe(2);
			elRefs.forEach((elRef: ElementRef) => {
				expect(elRef instanceof ElementRef).toBeTruthy();
			});
		});
	});

	/**
	 * @ContentChildren allows to read descendants
	 */
	describe('descendants -', () => {

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

					<simple [value]="'#1'">
					</simple>

					<simple [value]="'#2'">
						<simple [value]="'#3'">#3</simple>
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

		it('should get content from first level - no descendants', () => {

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

		it('should get all content children - with descendants', () => {

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

	/**
	 * Changing reference to observed components will trigger ContentChildren#changes.
	 */
	describe('QueryList changes -', () => {

		describe('component - ngIf', () => {

			const simpleValue = 'Johnny Bravo';

			@Component({
				selector: 'test',
				template: `
	
					<content-children>
						<simple *ngIf="flag"
								[value]="value">
						</simple>
					</content-children>
	
				`
			})
			class TestComponent {
				@ViewChild(ContentChildrenComponent)
				compRef: ContentChildrenComponent;

				flag: boolean = true;

				value = simpleValue;

				constructor(public changeDetectorRef: ChangeDetectorRef) {
				}
			}

			let fixture: ComponentFixture<TestComponent>,
				compInstance: TestComponent,
				simpleCompRefs: Array<SimpleComponent> = [];

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ContentChildrenComponent,
						TestComponent
					]
				});

				// given
				fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;

				simpleCompRefs = [];

				// when
				compInstance.flag = false;
				fixture.detectChanges();

				compInstance.compRef.simpleComponent.changes.subscribe(() => {
					simpleCompRefs = compInstance.compRef.simpleComponent.toArray();
				});

				// then
				expect(simpleCompRefs.length).toEqual(0);
			});

			/**
			 * Changing reference to the content component referenced by @ContentChildren,
			 * will trigger change.
			 */
			it('should be possible to observe changes made in the content', () => {

				// when
				compInstance.flag = true;
				fixture.detectChanges();

				// then
				expect(simpleCompRefs.length).toEqual(1);
				expect(simpleCompRefs[0].value).toEqual(simpleValue);
			});

			/**
			 * Changing value in the content component referenced by @ContentChildren,
			 * will not trigger any changes.
			 */
			it('is not possible to observe value changes made in the content', () => {

				// given
				const newValue = 'Time Duncan';

				// when
				compInstance.value = newValue;
				fixture.detectChanges();

				// then
				expect(simpleCompRefs.length).toEqual(0);
			});

		});

		describe('component - ngFor', () => {

			const simpleValues = [
				'Cow & Chicken',
				'Dexter\'s Lab',
				'I am Weasel',
				'Johnny Bravo'
			];

			@Component({
				selector: 'test',
				template: `
	
					<content-children>
						<simple *ngFor="let value of values"
								[value]="value">
						</simple>
					</content-children>
	
				`
			})
			class TestComponent {
				@ViewChild(ContentChildrenComponent)
				compRef: ContentChildrenComponent;

				values: Array<string> = [];

				constructor(public changeDetectorRef: ChangeDetectorRef) {
				}
			}

			let fixture: ComponentFixture<TestComponent>,
				compInstance: TestComponent,
				simpleCompRefs: Array<SimpleComponent> = [];

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ContentChildrenComponent,
						TestComponent
					]
				});

				// given
				fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;

				simpleCompRefs = [];

				// when
				fixture.detectChanges();

				compInstance.compRef.simpleComponent.changes.subscribe(() => {
					simpleCompRefs = compInstance.compRef.simpleComponent.toArray();
				});

				// then
				expect(simpleCompRefs.length).toEqual(0);
			});

			/**
			 * Changing reference to the content component referenced by @ContentChildren,
			 * will trigger change.
			 */
			it('should be possible to observe changes made in the content', () => {

				// when
				compInstance.values = simpleValues; // changing reference to an array
				fixture.detectChanges();

				// then
				expect(simpleCompRefs.length).toEqual(simpleValues.length);
				simpleCompRefs.forEach((c: SimpleComponent, index: number) => {
					expect(c.value).toEqual(simpleValues[index]);
				});
			});

		});

		describe('ng-template -', () => {

			@Component({
				selector: 'content-template',
				template: `
					<ng-content></ng-content>
				`
			})
			class ContentTemplateComponent {
				@ContentChildren(TemplateRef)
				templateQL: QueryList<TemplateRef<any>>;
			}

			@Component({
				selector: 'test',
				template: `
					<content-template>
						<ng-container #container></ng-container>
					</content-template>

					<ng-template #template>
						<p>Samurai Jack</p>
					</ng-template>
				`
			})
			class TestComponent {
				@ViewChild(ContentTemplateComponent)
				compRef: ContentTemplateComponent;

				@ViewChild('container', {read: ViewContainerRef})
				compVCR: ViewContainerRef;

				@ViewChild(TemplateRef)
				templRef: TemplateRef<any>;

				constructor(public changeDetectorRef: ChangeDetectorRef) {
				}
			}

			let fixture: ComponentFixture<TestComponent>,
				compInstance: TestComponent,
				templateRefs: Array<TemplateRef<any>> = [];

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						ContentTemplateComponent,
						TestComponent
					]
				});

				// given
				fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				compInstance.compRef.templateQL.changes.subscribe(() => {
					templateRefs = compInstance.compRef.templateQL.toArray();
				});

				// then
				expect(templateRefs.length).toEqual(0);
			});

			/**
			 * It's not possible to trigger changes, when you observe ng-template
			 * with ContentChildren.
			 */
			it('isn\'t possible to dynamically add ng-template', () => {

				compInstance.compVCR.createEmbeddedView(compInstance.templRef);

				// when
				fixture.detectChanges();

				// then
				expect(templateRefs.length).toEqual(0);
			});
		});


		/**
		 * Observe changes to a component with value and template.
		 */
		xdescribe('complex changes -', () => {

			const givenValue = 'Itachi Uchiha';

			@Component({
				selector: 'shifter',
				template: ``
			})
			class ShifterComponent implements AfterContentInit {
				@ContentChildren(TemplateRef)
				templateQL: QueryList<TemplateRef<any>>;

				@Input()
				value: string;

				templates: Array<TemplateRef<any>>;

				ngAfterContentInit() {
					this.updateTemplate();

					this.templateQL
						.changes
						.subscribe(() => {
							console.log('abc');
							this.updateTemplate();
						});
				}

				private updateTemplate(): void {
					this.templates = this.templateQL.toArray();
				}
			}

			@Component({
				selector: 'parent-shifter',
				template: ``
			})
			class ParentShifterComponent implements AfterContentInit {
				@ContentChildren(ShifterComponent)
				shifterQL: QueryList<ShifterComponent>;

				shifters: Array<ShifterComponent>;

				ngAfterContentInit() {
					this.updateShifter();

					this.shifterQL
						.changes
						.subscribe(() => {

							this.updateShifter();
						});
				}

				private updateShifter(): void {
					this.shifters = this.shifterQL.toArray();
				}
			}

			@Component({
				template: `
				
					<parent-shifter>
						
						<shifter [value]="value" #container *ngIf="flag" >
							
							<!-- Cannot use structural directives, like *ngIf -->
							<ng-template></ng-template>
							
						</shifter>
						
					</parent-shifter>
					
				`
			})
			class TestComponent {
				@ViewChild(ParentShifterComponent)
				parent: ParentShifterComponent;

				@ViewChild(TemplateRef)
				template: TemplateRef<any>;

				@ViewChild('container', {read: ViewContainerRef})
				container: ViewContainerRef;

				value = givenValue;

				flag = true;
			}

			let fixture: ComponentFixture<TestComponent>,
				compInstance: TestComponent;

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						declarations: [
							ShifterComponent,
							ParentShifterComponent,
							TestComponent
						]
					});
				fixture = TestBed.createComponent(TestComponent);
				compInstance = fixture.componentInstance;
			});

			it('should get initial values of shifter component', () => {

				fixture.detectChanges();

				// then
				const fixtureTemplate = [compInstance.template],
					shifters = compInstance.parent.shifters;

				expect(shifters.length).toBe(1);

				shifters.forEach((shifter: ShifterComponent) => {
					expect(shifter.value).toEqual(givenValue);
					expect(shifter.templates).toEqual(fixtureTemplate);
				});
			});

			xit('should react to changes', () => {

				//given
				const newValue = 'Jiraiya';
				fixture.detectChanges();

				// when
				compInstance.value = newValue;
				compInstance.container.clear();

				fixture.detectChanges();

				// then
				const shifters = compInstance.parent.shifters;

				expect(shifters.length).toBe(1);

				shifters.forEach((shifter: ShifterComponent) => {
					expect(shifter.value).toEqual(newValue);
					expect(shifter.templates.length).toEqual(0);
				});
			});
		});
	});

	describe('common examples -', () => {

		/**
		 * @ContentChildren allows to get different types when referencing a component
		 */
		describe('read -', () => {

			@Component({
				selector: 'content-children',
				template: ``
			})
			class ContentChildrenComponent {

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

						<simple #compOne [value]="'#1'">
						</simple>

						<simple #compTwo [value]="'#2'">
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

			it('should get component as different objects', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
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
			it('should be possible to get reference by template variable', () => {
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
		describe('directive -', () => {

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
				 * directive references as ElementRefs
				 */
				@ContentChildren(PropDirective, {read: ElementRef})
				dirAsElementRefs: QueryList<ElementRef>;

				/**
				 * directive references as ElementRefs
				 */
				@ContentChildren(PropDirective, {read: TemplateRef})
				dirAsTempRefs: QueryList<TemplateRef<any>>;

				/**
				 * directive references as ViewContainerRef
				 */
				@ContentChildren(PropDirective, {read: ViewContainerRef})
				dirAsVcrs: QueryList<ViewContainerRef>;

				/**
				 * directive references by template variable
				 */
				@ContentChildren('dirOne')
				dirByTemplVarRefs: QueryList<PropDirective>;
			}

			@Component({
				selector: 'test',
				template: `

					<content-children-for-directive>
						<p #dirOne="propDir" [propDir]="'#1'"></p>
						<p #dirTwo="propDir" [propDir]="'#2'"></p>
						<p #dirThree="propDir" [propDir]="'#3'"></p>
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

			/**
			 * When you want to get reference to a directive by @ContentChildren, you cannot use read option. It doesn't work.
			 */
			it('shouldn\'t be possible to use read parameter with directive', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
				let dirAsElementRefs = compInstance.compRef.dirAsElementRefs.toArray();
				expect(dirAsElementRefs.length).toEqual(3);
				expect(dirAsElementRefs[0] instanceof ElementRef).toBe(true, 'directiveRef as ElementRef'); // FALSE

				let dirAsTempRefs = compInstance.compRef.dirAsTempRefs.toArray();
				expect(dirAsTempRefs.length).toEqual(3);
				expect(dirAsTempRefs[0] instanceof TemplateRef).toBe(false, 'directiveRef as TemplateRef'); // FALSE

				let dirAsVcrs = compInstance.compRef.dirAsVcrs.toArray();
				expect(dirAsVcrs.length).toEqual(3);
				expect(isViewContainerRef(dirAsVcrs[0])).toBe(true, 'directiveRef as ViewContainerRef'); // FALSE
			});

			/**
			 * @ContentChildren allows to get reference to a directive by template variable
			 */
			it('should be possible to get reference by template variable', () => {
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
		describe('read ng-template -', () => {

			@Component({
				selector: 'content-children',
				template: ``
			})
			class ContentChildrenComponent {

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

						<ng-template #templOne>
						</ng-template>

						<ng-template #templTwo>
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

			it('should get template references as different objects', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				// when
				fixture.detectChanges();

				// then
				let templAsElementRefs = compInstance.compRef.templAsElementRefs.toArray();
				expect(templAsElementRefs.length).toEqual(2);
				expect(templAsElementRefs[0] instanceof ElementRef).toBe(true, 'TemplateRef as ElementRef'); // TRUE

				let templAsCompRefs = compInstance.compRef.templAsCompRefs.toArray();
				expect(templAsCompRefs.length).toEqual(0);
				expect(templAsCompRefs[0] instanceof SimpleComponent).toBe(false, 'TemplateRef as SimpleComponent'); // FALSE

				let templAsVcrs = compInstance.compRef.templAsVcrs.toArray();
				expect(templAsVcrs.length).toEqual(2);
				expect(isViewContainerRef(templAsVcrs[0])).toBe(true, 'TemplateRef as ViewContainerRef'); // TRUE
			});

			/**
			 * @ContentChildren allows to get reference to a template by template variable
			 */
			it('should be possible to get reference to a template by template variable', () => {

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

	});

});
