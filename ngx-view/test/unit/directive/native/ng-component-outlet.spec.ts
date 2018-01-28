import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
	class SimpleComponent {}

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

});
