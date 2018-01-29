import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('NgTemplateOutlet -', () => {

	describe('ng-template -', () => {

		const givenTemplate = 'Hello template!';

		@Component({
			template: `
				<ng-template #tmpl >
					${givenTemplate}
				</ng-template>
					
				<ng-container *ngTemplateOutlet="tmpl" ></ng-container>
			`
		})
		class TestComponent {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent
					]
				});
		});

		it ('should create view from ng-template', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.nativeElement.textContent.trim();

			expect(text).toEqual(givenTemplate);
		});

	});

});
