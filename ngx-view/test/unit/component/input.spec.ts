import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { componentFactoryName } from '@angular/compiler';

describe('Component - input -', () => {


	describe('order of changes -', () => {

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
			set inputOne(value: string) {
				valueChanges.push('Setter inputOne');
			}

			@Input()
			set inputTwo(value: string) {
				valueChanges.push('Setter inputTwo');
			}

			@Input()
			set inputThree(value: string) {
				valueChanges.push('Setter inputThree');
			}

			ngOnChanges(changes: SimpleChanges) {

				valueChanges.push('OnChanges');

				if (changes.inputOne) {
					valueChanges.push('OnChanges inputOne');
				}

				if (changes.inputTwo) {
					valueChanges.push('OnChanges inputTwo');
				}

				if (changes.inputThree) {
					valueChanges.push('OnChanges inputThree');
				}
			}
		}

		@Component({
			selector: 'test',
			template: `
				<basic [inputOne]="value" [inputTwo]="value" [inputThree]="value" ></basic>
			`
		})
		class TestComponent {

			value = 'Test';
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


		/**
		 * Inputs are invoked in the order of declaration in component.
		 */
		const expectedOrder = [
			'Setter inputOne',
			'Setter inputTwo',
			'Setter inputThree',
			'OnChanges',
			'OnChanges inputOne',
			'OnChanges inputTwo',
			'OnChanges inputThree'
		];

		it ('setting inital value via input should trigger changes', () => {

			// then
			expect(valueChanges).toEqual(expectedOrder);
		});

		it ('input changes should be triggered in specific order', () => {

			// then
			compInstance.value = 'new value';
			valueChanges = [];
			fixture.detectChanges();

			expect(valueChanges).toEqual(expectedOrder);
		});

	});

	describe ('naming -', () => {

		const compValue = 'Value';

		@Component({
			selector: 'alias',
			template: ``
		})
		class AliasComponent {

			@Input('inputOne')
			set inputValueOne(val: string) {
				this.value = val;
			}

			@Input('inputTwo')
			set inputValueTwo(val: string) {
				this.value = val;
			}

			value: string;
		}

		@Component({
			selector: 'test',
			template: `
			
				<alias #compOneRef [inputOne]="'Value'" ></alias>
				
				<alias #compTwoRef [inputTwo]="'Value'" ></alias>
			`
		})
		class TestComponent {

			@ViewChild('compOneRef')
			compOneRef: AliasComponent;

			@ViewChild('compTwoRef')
			compTwoRef: AliasComponent;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						AliasComponent,
						TestComponent
					]
				});

		});

		it ('should be possible to alias inputs', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.compOneRef.value).toEqual(compValue);
			expect(compInstance.compTwoRef.value).toEqual(compValue);
		});

	});

});
