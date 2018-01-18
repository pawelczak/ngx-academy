import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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

			@Input('inputTwo,inputThree')
			set inputValueMulti(val: string) {
				this.value = val;
			}

			value: string;
		}

		@Component({
			selector: 'test',
			template: `
				<alias #compRef [inputOne]="'Value'" ></alias>
			`
		})
		class TestComponent {
			@ViewChild('compRef')
			compRef: AliasComponent;
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
			const testTempl = `<alias #compRef [inputOne]="'Value'" ></alias>`;
			TestBed.overrideTemplate(TestComponent, testTempl);

			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.compRef.value).toEqual(compValue);
		});

		it ('shouldn\'t be possible to use input original name, when it is aliased', () => {

			// given
			const testTempl = `<alias #compRef [inputValueOne]="'Value'" ></alias>`;
			TestBed.overrideTemplate(TestComponent, testTempl);

			// when & then
			expect(() => TestBed.createComponent(TestComponent)).toThrowError();
		});

		/**
		 * @Input('inputTwo,inputThree') <- will throw error
		 */
		it ('not possible to specify multiple aliases', () => {

			// given
			const testTempl = `<alias #compRef [inputTwo]="'Value'" ></alias>`;
			TestBed.overrideTemplate(TestComponent, testTempl);

			// when & then
			expect(() => TestBed.createComponent(TestComponent)).toThrowError();
		});

	});

});
