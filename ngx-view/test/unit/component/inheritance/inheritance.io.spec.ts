import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Inheritance I/O -', () => {

	describe('input -', () => {

		const givenValue = 'Bruce Wayne';

		class InputComponent {

			@Input()
			value: string;
		}

		@Component({
			selector: 'inherited-input',
			template: `
				{{value}}
			`
		})
		class InheritedInputComponent extends InputComponent {
		}

		@Component({
			template: `
				<inherited-input [value]="value"></inherited-input>
			`
		})
		class TestComponent {

			value = givenValue;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					InheritedInputComponent,
					TestComponent
				]
			});
		});

		it('should inherited inputs', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.query(By.css('inherited-input')).nativeElement.textContent.trim();
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
			selector: 'inherited-output',
			template: `
				<button (click)="emit()"></button>
			`
		})
		class InheritedOutputComponent extends OutputComponent {

			emit(): void {
				this.valueChanged.emit(givenValue)
			}
		}

		@Component({
			template: `
				<inherited-output (valueChanged)="onValueChanged($event)" ></inherited-output>
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
					InheritedOutputComponent,
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
