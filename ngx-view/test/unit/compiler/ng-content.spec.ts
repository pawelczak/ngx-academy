import { Component, ContentChild, Inject, InjectionToken, Input, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Feature <ng-content> allows to project content.
 *
 * It kind of works like a portal.
 */
describe('ng-content -', () => {

	@Component({
		selector: 'simple',
		template: `
			{{value}}
		`
	})
	class SimpleComponent {
		@Input()
		value: string;
	}

	describe('content projection -', () => {

		@Component({
			selector: 'projector',
			template: `
				<p class="target">
					<ng-content></ng-content>
				</p>
			`
		})
		class ProjectorComponent {
		}

		@Component({
			selector: '',
			template: ``
		})
		class TestComponent {
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent,
						ProjectorComponent,
						SimpleComponent
					]
				});
		});

		it('should project basic html', () => {

			// given
			TestBed.overrideTemplate(TestComponent, `
				<projector>
					<div class="projected-element"></div>
				</projector>
			`);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.debugElement.queryAll(By.css('.target > .projected-element'));

			expect(el).not.toBeNull();
			expect(el).toBeTruthy();
		});

		it('should project components', () => {

			// given
			TestBed.overrideTemplate(TestComponent, `
				<projector>
					<simple class="projected-component" ></simple>
				</projector>
			`);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.debugElement.query(By.css('.target > .projected-component'));

			expect(el).not.toBeNull();
			expect(el).toBeTruthy();
		});

	});

	/**
	 * Multi ng-content.
	 *
	 * Ng-content projection is kind of like move operation.
	 */
	describe('multi -', () => {

		@Component({
			selector: 'projector',
			template: `
				<div class="portal-one">
					<ng-content></ng-content>
				</div>
				<div class="portal-two">
					<ng-content></ng-content>
				</div>
				<div class="portal-three">
					<ng-content></ng-content>
				</div>
			`
		})
		class ProjectorComponent {
		}

		@Component({
			selector: '',
			template: `
				<projector>
					<simple></simple>
				</projector>
			`
		})
		class ParentComponent {
		}

		let fixture: ComponentFixture<ParentComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ProjectorComponent,
					ParentComponent
				]
			});
			fixture = TestBed.createComponent(ParentComponent);
			fixture.detectChanges();
		});

		it('should project component to only one ng-content', () => {

			// when & then
			const simple = fixture.debugElement.queryAll(By.css('simple'));

			expect(simple.length).toBe(1);
		});

		it('should project component to last', () => {

			// when & then
			const portalOne = fixture.debugElement.queryAll(By.css('.portal-one > simple')),
				portalTwp = fixture.debugElement.queryAll(By.css('.portal-two > simple')),
				portalThree = fixture.debugElement.queryAll(By.css('.portal-three > simple'));

			expect(portalOne.length).toBe(0, 'Portal-one');
			expect(portalTwp.length).toBe(0, 'Portal-two');
			expect(portalThree.length).toBe(1, 'Portal-three');
		});

	});

	/**
	 * <ng-content> supports a select attribute that lets you project specific content in specific places.
	 * This attribute takes a CSS selector like:
	 * - HTML tag e.g. my-element,
	 * - CSS class e.g. .my-class,
	 * - Attribute [my-attribute]
	 * to match the children you want.
	 */
	describe('select -', () => {

		@Component({
			selector: 'projector',
			template: `
				<div class="portal-one">
					<ng-content select="simple"></ng-content>
				</div>
				<div class="portal-two">
					<ng-content select=".cssClass"></ng-content>
				</div>
				<div class="portal-three">
					<ng-content select="[data-attr]"></ng-content>
				</div>
			`
		})
		class ProjectorComponent {
		}

		describe('different selectors -', () => {

			@Component({
				template: `
					<projector>

						<!--Tag HTML 'simple' -->
						<simple value="#1" ></simple>

						<!--CSS class '.css-class'-->
						<div class="cssClass" >
							#2
						</div>

						<!--Attribute 'data-attr' -->
						<div data-attr="" >
							#3
						</div>

					</projector>
				`
			})
			class ParentComponent {
			}

			let fixture: ComponentFixture<ParentComponent>;

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ProjectorComponent,
						ParentComponent
					]
				});
				fixture = TestBed.createComponent(ParentComponent);
				fixture.detectChanges();
			});

			it('should project component by HTML tag selector', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-one > *'));

				expect(el.length).toEqual(1, 'only one element being projected');
				expect(el[0].nativeElement.textContent.trim()).toEqual('#1');
			});

			it('should project component by CSS class selector', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-two > *'));

				expect(el.length).toEqual(1, 'only one element being projected');
				expect(el[0].nativeElement.textContent.trim()).toEqual('#2');
			});

			it('should project component by Attribute selector', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-three > *'));

				expect(el.length).toEqual(1, 'only one element being projected');
				expect(el[0].nativeElement.textContent.trim()).toEqual('#3');
			});
		});

		/**
		 * <ng-content> select catches the first element that matches the selector.
		 */
		describe('selector collision -', () => {

			@Component({
				template: `
					<projector>

						<!--Tag HTML 'simple' -->
						<simple value="#1" ></simple>

						<!--CSS class '.css-class'-->
						<simple value="#2" class="cssClass" ></simple>

					</projector>
				`
			})
			class ParentComponent {
			}

			let fixture: ComponentFixture<ParentComponent>;

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ProjectorComponent,
						ParentComponent
					]
				});
				fixture = TestBed.createComponent(ParentComponent);
				fixture.detectChanges();
			});

			/**
			 * First <ng-content select="simple"> catches both elements,
			 * eventhought the second simple component has a class that
			 * matches the second <ng-content> select case.
			 */
			it('should project component by HTML tag selector', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-one > *'));

				expect(el.length).toEqual(2, 'both elements being projected');
				expect(el[0].nativeElement.textContent.trim()).toEqual('#1');
				expect(el[1].nativeElement.textContent.trim()).toEqual('#2');
			});
		});

		/**
		 * Allows element to be projected as a specific case.
		 */
		describe('ngProjectAs -', () => {

			@Component({
				template: `
					<projector>

						<div ngProjectAs="simple"
							 class="cssClass" >
							#1
						</div>

						<simple ngProjectAs=".cssClass"
								value="#2"
								class="cssClass">
						</simple>

					</projector>
				`
			})
			class ParentComponent {
			}

			let fixture: ComponentFixture<ParentComponent>;

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ProjectorComponent,
						ParentComponent
					]
				});
				fixture = TestBed.createComponent(ParentComponent);
				fixture.detectChanges();
			});

			it('should project div as component case', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-one > *'));

				expect(el.length).toBe(1);
				expect(el[0].nativeElement.textContent.trim()).toEqual('#1');
			});

			it('should project component as css class case', () => {

				// when & then
				const el = fixture.debugElement.queryAll(By.css('.portal-two > *'));

				expect(el.length).toBe(1);
				expect(el[0].nativeElement.textContent.trim()).toEqual('#2');
			});
		});

	});

	/**
	 * <ng-content> just moves ("projects") content.
	 * It makes interesting use cases with structural directives
	 * like *ngIf and *ngFor.
	 */
	describe('structural directives', () => {

		/**
		 * Using *ngIf with ng-content, creating and removing ng-content
		 * should not create create & destroy projected elements,
		 * it should just create and remove place where projected elements
		 * should appear.
		 */
		describe('*ngIf', () => {

			@Component({
				selector: 'simple',
				template: ``
			})
			class SimpleComponent {
				static counter = 0;

				constructor() {
					SimpleComponent.counter += 1;
				}
			}

			@Component({
				selector: 'projector',
				template: `
					<ng-content *ngIf="flag"></ng-content>
				`
			})
			class ProjectorComponent {
				flag = false;
			}

			@Component({
				selector: 'parent',
				template: `
					<projector>
						<simple></simple>
					</projector>
				`
			})
			class ParentComponent {
				@ViewChild(ProjectorComponent)
				projectorRef: ProjectorComponent;
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SimpleComponent,
						ProjectorComponent,
						ParentComponent
					]
				});
				SimpleComponent.counter = 0;
			});


			/**
			 * Although component is not projected, it has been created.
			 *
			 * <ng-content> work like move, so '*ngIf=false' doesn't affect
			 * creation of a projected content it only says that it shouldn't be moved.
			 */
			it('should not project element', () => {

				// given
				const fixture = TestBed.createComponent(ParentComponent);

				// when
				fixture.detectChanges();

				//then
				const el = fixture.debugElement.query(By.css('simple'));

				expect(el).toBeNull();
				expect(SimpleComponent.counter).toBe(1);
			});

			it('should project element', () => {

				// given
				const fixture = TestBed.createComponent(ParentComponent);

				// when
				fixture.componentInstance.projectorRef.flag = true;
				fixture.detectChanges();

				//then
				const el = fixture.debugElement.query(By.css('simple'));

				expect(el).not.toBeNull();
				expect(SimpleComponent.counter).toBe(1);
			});

		});

	});

	/**
	 * Projected component can be accessed by ViewChild from ParentComponent
	 * level and from ProjectorComponent level by ContentChild.
	 */
	describe('reference -', () => {

		@Component({
			selector: 'projector',
			template: `
				<ng-content></ng-content>
			`
		})
		class ProjectorComponent {
			@ContentChild(SimpleComponent)
			simpleRef: SimpleComponent;
		}

		@Component({
			selector: 'parent',
			template: `
				<projector>
					<simple></simple>
				</projector>
			`
		})
		class ParentComponent {
			@ViewChild(ProjectorComponent)
			projectorRef: ProjectorComponent;

			@ViewChild(SimpleComponent)
			simpleRef: SimpleComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ProjectorComponent,
					ParentComponent
				]
			})
		});

		it('should be possible to get reference from parent and projector', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				parentInstance = fixture.componentInstance,
				projectorInstance = parentInstance.projectorRef;

			// when
			fixture.detectChanges();

			// then
			expect(parentInstance.simpleRef instanceof SimpleComponent).toBeTruthy();
			expect(projectorInstance.simpleRef instanceof SimpleComponent).toBeTruthy();
			expect(parentInstance.simpleRef).toBe(projectorInstance.simpleRef);
		});

	});

	/**
	 * Projected component lives in the context of the component,
	 * in which it has been declared.
	 */
	describe('context -', () => {

		const token = new InjectionToken<string>('NG_CONTENT_CONTEXT'),
			projector = 'projector',
			parent = 'parent';

		@Component({
			selector: 'simple',
			template: ``
		})
		class SimpleComponent {
			constructor(@Inject(token) public context: string) {}
		}

		@Component({
			selector: 'projector',
			template: `
				<ng-content></ng-content>
			`,
			providers: [{
				provide: token,
				useValue: projector
			}]
		})
		class ProjectorComponent {
		}

		@Component({
			selector: 'parent',
			template: `
				<projector>
					<simple></simple>
				</projector>
			`,
			providers: [{
				provide: token,
				useValue: parent
			}]
		})
		class ParentComponent {
			@ViewChild(SimpleComponent)
			simpleRef: SimpleComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SimpleComponent,
					ProjectorComponent,
					ParentComponent
				]
			})
		});

		/**
		 * Components that are projected with ng-content, live in the context
		 * of the component in which they are declared.
		 */
		it('should create component in the parent context', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				simpleCompInstance = fixture.componentInstance.simpleRef;

			// when
			fixture.detectChanges();

			// then
			expect(simpleCompInstance.context).toEqual(projector);
		});
	});
});

