import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Feature ng-content allows to project content.
 *
 * It kind of works like a portal.
 */
describe('ng-content -', () => {

	describe('content projection -', () => {

		@Component({
			selector: 'projector',
			template: `
				<ng-content></ng-content>
			`
		})
		class ProjectorTemplate {}

		@Component({
			selector: '',
			template: `
				
			`
		})
		class TestComponent {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent,
						ProjectorTemplate
					]
				});
		});

		it ('should project basic html', () => {

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

	});

});

