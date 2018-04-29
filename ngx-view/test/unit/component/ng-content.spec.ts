import { Component, ContentChild, Host, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Feature ng-content allows to project content.
 *
 * It kind of works like a portal.
 */
describe('ng-content -', () => {

	@Component({
		selector: 'simple',
		template: ``
	})
	class SimpleComponent {
	}

	describe('content projection -', () => {

		@Component({
			selector: 'projector',
			template: `
				<ng-content></ng-content>
			`
		})
		class ProjectorComponent {
		}

		@Component({
			selector: '',
			template: `

			`
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
					<div></div>
				</projector>
			`);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.debugElement.queryAll(By.css('div'));

			expect(el).toBeDefined();
		});

		it('should project components', () => {

			// given
			TestBed.overrideTemplate(TestComponent, `
				<projector>
					<simple></simple>
				</projector>
			`);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.debugElement.query(By.css('simple'));

			expect(el).toBeDefined();
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
	 * Projected component can be accesed by ViewChild from ParentComponent
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

