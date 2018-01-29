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

	/**
	 * NgTemplateOutput can provide context for created template
	 */
	describe('ng-template with context -', () => {

		const heroName = 'Wolverine';

		@Component({
			template: `
				<ng-template #tmpl let-hero="hero">
					<p class="hero-name" >{{hero}}</p>
				</ng-template>
					
				<ng-container *ngTemplateOutlet="tmpl; context: templateContext" ></ng-container>
			`
		})
		class TestComponent {
			templateContext = {
				hero: heroName
			}
		}

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

		it ('should create view from ng-template with context', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.nativeElement.textContent.trim();

			expect(text).toEqual(heroName);
		});

	});

});
