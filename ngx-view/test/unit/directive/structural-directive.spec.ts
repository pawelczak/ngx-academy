import { Component, Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef, OnChanges } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';


describe('Structural directive -', () => {

	@Directive({
		selector: '[even]'
	})
	class EvenDirective implements OnChanges {

		@Input()
		set even(arg: number) {}

		constructor(private templateRef: TemplateRef<any>,
					private viewContainerRef: ViewContainerRef) {}

		ngOnChanges(changes: SimpleChanges) {
			if ('even' in changes) {
				if ((changes.even.currentValue % 2) === 0) {
					this.viewContainerRef.createEmbeddedView(this.templateRef);
				} else {
					this.viewContainerRef.clear();
				}
			}
		}
	}

	describe('template use -', () => {

		@Component({
			selector: 'test',
			template: `<div >
							<ng-template [even]="number" >
								<p>Even</p>
							</ng-template>
						</div>
			`
		})
		class TestComponent {
			number = 0;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent,
						EvenDirective
					]
				})
		});


		it ('should show template for number 2', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			compInstance.number = 2;
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelectorAll('p');
			expect(pTag[0].textContent.trim()).toEqual('Even');
		});

		it ('should not show template for number 1', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			compInstance.number = 1;
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelectorAll('p');
			expect(pTag.length).toBe(0);
		});

	});

	describe('structural use -', () => {

		@Component({
			selector: 'test',
			template: `<div >
							<div *even="number" >
								<p>Even</p>
							</div>
						</div>
			`
		})
		class TestComponent {
			number = 0;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent,
						EvenDirective
					]
				})
		});

		it ('should show template for number 2', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			compInstance.number = 2;
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelectorAll('p');
			expect(pTag[0].textContent.trim()).toEqual('Even');
		});

		it ('should not show template for number 1', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			compInstance.number = 1;
			fixture.detectChanges();

			// then
			const pTag = fixture.debugElement.nativeElement.querySelectorAll('p');
			expect(pTag.length).toBe(0);
		});

	});

});
