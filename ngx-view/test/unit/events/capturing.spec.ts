import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


/**
 * Events capturing is propagation of event towards down
 */
describe('Events -', () => {

	describe('capturing -', () => {

		@Component({
			selector: 'btn,[btn]',
			template: `
				<button [disabled]="isDisabled" >
				<!--<button (click)="onClick($event)">-->
					<ng-content></ng-content>
				</button>
			`,
			host: {
				'[attr.disabled]': 'isDisabled',
				'(click)': 'onClick($event)'
			}
		})
		class ButtonComponent {
			@Input('disabled')
			isDisabled = true;

			onClick(event: Event) {
				console.log(event);
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
			}
		}

		@Component({
			selector: 'test',
			template: `
				<btn (click)="onClick()" >
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
				imports: [],
				declarations: [
					ButtonComponent,
					TestComponent
				]
			});
		});

		it ('should be not be posible to click on disabled button', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			const button = fixture.debugElement.query(By.css('button'));
			button.nativeElement.click();

			// then
			expect(fixture.componentInstance.clicked).toBeFalsy();
		});

	});

});
