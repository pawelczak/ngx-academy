import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('Forms - ', () => {


	describe('basic usage -', () => {

		@Component({
			selector: 'test',
			template: `
			
				<form [formGroup]="form" >
					
					<input formControlName="name" />
					
					<button>Submit</button>
					
				</form>
			
			`
		})
		class FormsComponent {

			form: FormGroup;

			constructor(public formBuilder: FormBuilder) {
				this.formBuilder.group({
					name: ''
				});
			}
		}


	});

});
