import { Component, Host, Inject, InjectionToken, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Feature ng-content allows to project content.
 *
 * It kind of works like a portal.
 */
fdescribe('ng-content -', () => {

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
			const el = fixture.debugElement.queryAll(By.css('simple'));

			expect(el).toBeDefined();
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

