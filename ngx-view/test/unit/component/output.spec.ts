import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component - output -', () => {

	/**
	 * It's possible to alias outputs.
	 */
	describe('naming -', () => {

		const compValue = 'Value';

		@Component({
			selector: 'output-alias',
			template: ``
		})
		class OutputAliasComponent {

			@Output('output-one')
			outputOne = new EventEmitter();

			emit() {
				this.outputOne.emit(compValue);
			}
		}

		@Component({
			selector: 'test',
			template: `
				<output-alias #compRef (output-one)="onEmit($event)"></output-alias>
			`
		})
		class TestComponent {
			@ViewChild('compRef', { static: true })
			compRef: OutputAliasComponent;

			value: string;

			onEmit(value: any) {
				this.value = value;
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						OutputAliasComponent,
						TestComponent
					]
				});
		});

		it('should be possible to alias outputs', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();
			compInstance.compRef.emit();

			// then
			expect(compInstance.value).toEqual(compValue);
		});
	});
});
