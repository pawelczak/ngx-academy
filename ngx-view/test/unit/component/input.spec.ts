import { Component, Directive, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component - input -', () => {

	fdescribe('order of changes -', () => {

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

		/**
		 * Inputs are invoked in the order of declarations in the component
		 */
		it ('setting initial value via input should trigger changes', () => {

			// when
			valueChanges = [];
			fixture = TestBed.createComponent(TestComponent);
			compInstance = fixture.componentInstance;
			fixture.detectChanges();

			// then
			expect(valueChanges).toEqual(expectedOrder);
		});

		it ('input changes should be triggered in specific order', () => {

			valueChanges = [];
			fixture = TestBed.createComponent(TestComponent);
			compInstance = fixture.componentInstance;
			fixture.detectChanges();

			// when
			compInstance.value = 'new value';
			valueChanges = [];
			fixture.detectChanges();

			// then
			expect(valueChanges).toEqual(expectedOrder);
		});

		/**
		 * Changing the order of input declarations in component,
		 * doesn't affect the order of which they are invoked.
		 */
		it ('should not change order of input invocations', () => {

			// given
			const templ = `
				<basic [inputTwo]="value" [inputThree]="value" [inputOne]="value" ></basic>
			`;
			valueChanges = [];
			TestBed.overrideTemplate(TestComponent, templ);
			fixture = TestBed.createComponent(TestComponent);
			compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
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

	describe('same input name -', () => {

		let valueChanges: Array<string> = [];

		@Component({
			selector: 'input-comp',
			template: ``
		})
		class InputComponent {
			@Input('value')
			set inputValue(value: string) {
				this.value = value;
				valueChanges.push('Component setter');
			}

			value: string;
		}

		@Directive({
			selector: '[input-dir]'
		})
		class InputDirective {
			@Input('value')
			set inputValue(value: string) {
				this.value = value;
				valueChanges.push(`Directive setter${this.id}`);
				console.log(this.id)
			}

			@Input('input-dir')
			id: string = '';

			value: string;
		}

		@Component({
			selector: 'test',
			template: `
				<input-comp [input-dir]="'sad'" [value]="'Hello'" ></input-comp>
			`
		})
		class TestComponent {
			@ViewChild(InputComponent)
			compRef: InputComponent;

			@ViewChild(InputDirective)
			dirRef: InputDirective;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [],
				declarations: [
					InputComponent,
					InputDirective,
					TestComponent
				]
			});
		});

		it ('should be possible to use same input name for component and directive', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				comp = fixture.componentInstance.compRef,
				dir = fixture.componentInstance.dirRef;

			// when
			fixture.detectChanges();

			// then
			expect(comp.value).toBe('Hello');
			expect(dir.value).toBe('Hello');
		});

		it ('should invoke setters in specific order', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				expectedChanges = [
					'Component setter',
					'Directive setter'
				];

			valueChanges = [];

			// when
			fixture.detectChanges();

			// then
			expect(valueChanges).toEqual(expectedChanges);
		});

		xit ('should invoke directive input in order of declaration in template', () => {

			// given
			const templ = `<input-comp [input-dir]="' - #1'" input-dir=" - #2" [value]="'Hello'" input-dir=" - #3" ></input-comp>`;
			TestBed.overrideTemplate(TestComponent, templ);

			const fixture = TestBed.createComponent(TestComponent),
				expectedChanges = [
					'Component setter',
					'Directive setter - #1',
					'Directive setter - #2',
					'Directive setter - #3'
				];

			valueChanges = [];

			// when
			fixture.detectChanges();

			// then
			expect(valueChanges).toEqual(expectedChanges);
		});

	});

});
