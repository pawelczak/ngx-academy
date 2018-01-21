import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';


/**
 * Events propagation up
 *
 * <body>
 *
 *     ^
 *     |
 *
 *   <button>
 */
xdescribe('Events -', () => {

	describe('bubbling -', () => {

		@Component({
			selector: 'btn',
			template: `
				<button [disabled]="disabled">
					<ng-content></ng-content>
				</button>
			`
		})
		class ButtonComponent {
			@Input()
			disabled = true;
		}

		@Component({
			selector: 'test',
			template: `
				<btn [disabled]="true" (click)="onClick()" >
					Hello
				</btn>
			`
		})
		class TestComponent {
			clicked = false;

			onClick() {
				this.clicked = true;
				console.log('asd');
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					CommonModule,
					BrowserModule
				],
				declarations: [
					ButtonComponent,
					TestComponent
				]
			});
		});

		it ('should be not be posible to click on disabled button', fakeAsync(() => {

			const fixture = TestBed.createComponent(TestComponent);

			fixture.detectChanges();


			const button = fixture.debugElement.query(By.css('btn'));

			button.triggerEventHandler('click', null);
			tick();
			fixture.detectChanges();

			expect(fixture.componentInstance.clicked).toBeFalsy();
		}));

	});

});
