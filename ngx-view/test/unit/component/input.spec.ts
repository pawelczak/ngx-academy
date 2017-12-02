import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Component - input -', () => {

	describe('basic -', () => {

		const newValue = 'new value';
		let fixture: any,
			compInstance: any,
			valueChanges: Array<string> = [];

		@Component({
			selector: 'basic',
			template: ``
		})
		class BasicComponent implements OnChanges {

			@Input()
			set value(value: string) {
				valueChanges.push('Input - ' + value);
			}

			ngOnChanges(changes: SimpleChanges) {
				if (changes.value) {
					valueChanges.push('OnChanges - ' + changes.value.currentValue);
				}
			}
		}

		@Component({
			selector: 'test',
			template: `
				<basic [value]="value" ></basic>
			`
		})
		class TestComponent {

			value = '';

			ngOnInit() {
				this.value = newValue;
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						BasicComponent,
						TestComponent
					]
				});
			fixture = TestBed.createComponent(TestComponent);
			compInstance = fixture.componentInstance;
			fixture.detectChanges();
		});

		it ('input changes should be triggered in specific order', () => {

			// then
			expect(valueChanges).toEqual([`Input - ${newValue}`, `OnChanges - ${newValue}`]);
		});

	});

});
