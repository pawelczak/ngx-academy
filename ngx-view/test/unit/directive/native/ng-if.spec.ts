import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';


describe('NgIf -', () => {

	@Component({
		selector: 'test',
		template: ``
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
			})
	});

	describe('structural use -', () => {

		it ('should be possible to render template based on a condition', () => {

			// given
			const testTemplate = `<p *ngIf="true">Text</p>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Text');
		});

		it ('should be possible to render else condition', () => {

			// given
			const testTemplate = `<p *ngIf="false; else elseTempl">Text</p>
									<ng-template #elseTempl>
										<p>Else</p>
									</ng-template>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Else');
		});

		it ('should be possible to render then condition', () => {

			// given
			const testTemplate = `<p *ngIf="true; then thenTempl else elseTempl">Text</p>
									<ng-template #elseTempl>
										<p>Else</p>
									</ng-template>
									<ng-template #thenTempl>
										<p>Then</p>
									</ng-template>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Then');
		});

	});

	describe('ng-template use -', () => {

		it ('should be possible to render template based on a condition', () => {

			// given
			const testTemplate = `<ng-template [ngIf]="true">
									<p>Text</p>
								  </ng-template>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Text');
		});

		it ('should be possible to render else condition', () => {

			// given
			const testTemplate = `<ng-template [ngIf]="false" [ngIfElse]="elseTempl">
									<p>Text</p>
								  </ng-template>
								  <ng-template #elseTempl>
									<p>Else</p>
								  </ng-template>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Else');
		});

		it ('should be possible to render then condition', () => {

			// given
			const testTemplate = `<ng-template [ngIf]="true" [ngIfThen]="thenTempl">
									<p>Text</p>
								  </ng-template>
								  <ng-template #elseTempl>
									<p>Else</p>
								  </ng-template>
								  <ng-template #thenTempl>
									<p>Then</p>
								  </ng-template>`;

			TestBed.overrideTemplate(TestComponent, testTemplate);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelector('p');

			expect(pTag).toBeDefined();
			expect(pTag.textContent.trim()).toBe('Then');
		});

	});

});
