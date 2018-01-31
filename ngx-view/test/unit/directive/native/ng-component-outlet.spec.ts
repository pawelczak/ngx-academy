import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Injectable, Injector, Optional, StaticProvider, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('NgComponentOutlet -', () => {

	const givenSimpleTemplate = 'Simple Component',
		givenOtherTemplate = 'Other Component';

	@Component({
		selector: 'simple',
		template: `
				${givenSimpleTemplate}
			`
	})
	class SimpleComponent {
	}

	@Component({
		selector: 'other',
		template: `
				${givenOtherTemplate}
			`
	})
	class OtherComponent {}

	/**
	 * NgComponentOutlet allows to create dynamic component, just by passing class name.
	 */
	describe('creation by class -', () => {

		@Component({
			template: `
				<ng-container *ngComponentOutlet="dynamicComponent"></ng-container>
			`,
			entryComponents: [
				SimpleComponent,
				OtherComponent
			]
		})
		class TestComponent {
			dynamicComponent = SimpleComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					CommonModule
				],
				declarations: [
					SimpleComponent,
					OtherComponent,
					TestComponent
				]
			});
		});

		/**
		 * Passing component to NgComponentOutlet will create a new component.
		 */
		it ('should create component', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const simpleComp = fixture.debugElement.query(By.css('simple')).nativeElement;

			expect(simpleComp).toBeDefined();
			expect(simpleComp.textContent.trim()).toEqual(givenSimpleTemplate);
		});

		it ('should allow to change created component to different one', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.componentInstance.dynamicComponent = OtherComponent;
			fixture.detectChanges();

			// then
			const otherComp = fixture.debugElement.query(By.css('other')).nativeElement;

			expect(otherComp).toBeDefined();
			expect(otherComp.textContent.trim()).toEqual(givenOtherTemplate);
		});

	});

	/**
	 * Pass custom injector
	 */
	describe('ngComponentOutletInjector -', () => {

		const givenValue = 'Jack Hughman';

		@Injectable()
		class Service {
			value = givenValue;
		}

		@Component({
			selector: 'basic',
			template: `{{service.value}}`
		})
		class BasicComponent {
			constructor(public service: Service) {}
		}

		@Component({
			template: `
				<div *ngComponentOutlet="component; injector: injectorExpression" #compRef ></div>
			`,
			entryComponents: [
				BasicComponent
			]
		})
		class TestComponent {

			component = BasicComponent;

			injectorExpression: Injector;

			constructor(private injector: Injector) {
				const customProviders = [{ provide: Service, useClass: Service, deps: []} as StaticProvider];
				this.injectorExpression = Injector.create(customProviders, this.injector);
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						BasicComponent,
						TestComponent
					]
				});
		});

		it ('should be possible to pass injector to component outlet', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const compRef = fixture.debugElement.query(By.css('basic')).nativeElement;

			expect(compRef).toBeDefined();
			expect(compRef.textContent.trim()).toEqual(givenValue);
		});

	});

	/**
	 * NgComponentOutletContent
	 */
	describe('ngComponentOutletContent -', () => {

		const givenTemplate = 'Bruce Wayne';

		@Component({
			selector: '',
			template: `
				<div *ngComponentOutlet="component; content: contentNodes" #compRef ></div>

				<ng-template #tmplRef >${givenTemplate}</ng-template>
			`,
			entryComponents: [
				SimpleComponent
			]
		})
		class TestComponent {
			@ViewChild('tmplRef')
			templateRef: TemplateRef<any>;

			contentNodes: Array<Array<any>>;

			component = SimpleComponent;

			constructor(public viewContainerRef: ViewContainerRef) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent,
						SimpleComponent
					]
				});
		});

		it ('should work with content', () => {

			// given
			TestBed.overrideTemplate(SimpleComponent, '<ng-content></ng-content>');

			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			fixture.detectChanges();

			// when
			const view = compInstance.viewContainerRef.createEmbeddedView(compInstance.templateRef);

			compInstance.contentNodes = [view.rootNodes];

			fixture.detectChanges();

			// then
			expect(fixture.nativeElement.textContent.trim()).toBe(givenTemplate);
		});

	});

});
