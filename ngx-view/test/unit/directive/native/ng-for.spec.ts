import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';


describe('NgFor -', () => {

	@Component({
		selector: 'ngfor-test',
		template: ``
	})
	class NgForTestComponent {

		heroes = ['spiderman', 'wolverine', 'xavier'];
	}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [
					CommonModule
				],
				declarations: [
					NgForTestComponent
				]
			})
	});

	describe('structural use -', () => {

		it ('should render basic list', () => {

			// given
			const templ = `<p *ngFor="let hero of heroes">
								{{hero}}
							</p>`;

			TestBed.overrideTemplate(NgForTestComponent, templ);
			const fixture = TestBed.createComponent(NgForTestComponent),
				componentInst = fixture.componentInstance,
				nativeEl = fixture.debugElement.nativeElement;

			// when
			fixture.detectChanges();

			// then
			const tags = nativeEl.querySelectorAll('p');
			expect(tags.length).toBe(componentInst.heroes.length);
			tags.forEach((tag: any, index: number) => {
				expect(tag.textContent.trim()).toEqual(componentInst.heroes[index]);
			});

		});

	});

	describe('template use -', () => {

		it ('should render basic list', () => {

			// given
			const templ = `<ng-template ngFor [ngForOf]="heroes" let-hero>
								<p>{{hero}}</p>
							</ng-template>`;

			TestBed.overrideTemplate(NgForTestComponent, templ);
			const fixture = TestBed.createComponent(NgForTestComponent),
				componentInst = fixture.componentInstance,
				nativeEl = fixture.debugElement.nativeElement;

			// when
			fixture.detectChanges();

			// then
			const tags = nativeEl.querySelectorAll('p');
			expect(tags.length).toBe(componentInst.heroes.length);
			tags.forEach((tag: any, index: number) => {
				expect(tag.textContent.trim()).toEqual(componentInst.heroes[index]);
			});

		});

	});

});
