import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Component Inheritance - I/O -', () => {

	describe('input -', () => {

		const givenValue = 'Bruce Wayne';

		class InputComponent {

			@Input()
			value: string;
		}

		@Component({
			selector: 'sub-input',
			template: `
				{{value}}
			`
		})
		class SubInputComponent extends InputComponent {
		}

		@Component({
			template: `
				<sub-input [value]="value"></sub-input>
			`
		})
		class TestComponent {

			value = givenValue;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubInputComponent,
					TestComponent
				]
			});
		});

		it('should inherit inputs', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.query(By.css('sub-input')).nativeElement.textContent.trim();
			expect(text).toEqual(givenValue);
		});
	});


	describe('output -', () => {

		const givenValue = 'Bruce Wayne';

		class OutputComponent {

			@Output()
			valueChanged = new EventEmitter();
		}

		@Component({
			selector: 'sub-output',
			template: `
				<button (click)="emit()"></button>
			`
		})
		class SubOutputComponent extends OutputComponent {

			emit(): void {
				this.valueChanged.emit(givenValue)
			}
		}

		@Component({
			template: `
				<sub-output (valueChanged)="onValueChanged($event)" ></sub-output>
			`
		})
		class TestComponent {

			value: string;

			onValueChanged(value: string): void {
				this.value = value;
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubOutputComponent,
					TestComponent
				]
			});
		});

		it('should inherited inputs', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();

			// when
			fixture.debugElement.query(By.css('button')).nativeElement.click();

			// then
			expect(fixture.componentInstance.value).toEqual(givenValue);
		});
	});
});
