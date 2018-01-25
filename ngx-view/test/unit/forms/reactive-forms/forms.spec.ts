import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';


describe('Forms - ', () => {

	describe('basic usage -', () => {

		@Component({
			selector: 'test',
			template: `
			
				<form [formGroup]="form" >
					
					<input formControlName="name" id="input-name" />
					
					<button>Submit</button>
					
				</form>
			
			`
		})
		class FormsComponent {

			form: FormGroup;

			constructor(public formBuilder: FormBuilder) {
				this.form = this.formBuilder.group({
					name: ['']
				});
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						ReactiveFormsModule
					],
					declarations: [
						FormsComponent
					]
				});
		});

		it ('should be couple of ways to get data out of form', () => {

			// given
			const fixture = TestBed.createComponent(FormsComponent);

			// then
			expect(fixture.componentInstance.form.get('name').value).toBe('');
			expect(fixture.componentInstance.form.controls.name.value).toBe('');
		});

		it ('should be couple of ways to set data in a form', () => {

			// given
			const fixture = TestBed.createComponent(FormsComponent);

			fixture.componentInstance.form.get('name').setValue('Jane');
			expect(fixture.componentInstance.form.get('name').value).toBe('Jane');

			fixture.componentInstance.form.controls['name'].setValue('Joe');
			expect(fixture.componentInstance.form.controls.name.value).toBe('Joe');
		});

		it ('should have default form values', () => {

			// given
			const fixture = TestBed.createComponent(FormsComponent),
				form = fixture.componentInstance.form;

			expect(form.status).toBe('VALID', 'status');
			expect(form.valid).toBe(true, 'valid');
			expect(form.invalid).toBe(false, 'invalid');
			expect(form.pending).toBe(false, 'pending');
			expect(form.disabled).toBe(false, 'disabled');
			expect(form.enabled).toBe(true, 'enabled');
			expect(form.pristine).toBe(true, 'pristine');
			expect(form.dirty).toBe(false, 'dirty');
			expect(form.touched).toBe(false, 'touched');
			expect(form.untouched).toBe(true, 'untouched');
		});

	});

});
