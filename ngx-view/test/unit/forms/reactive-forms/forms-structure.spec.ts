import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';


describe('Forms - ', () => {

	describe('basic usage -', () => {

		@Component({
			selector: 'test',
			template: `

				<form [formGroup]="form">

					<fieldset [formGroup]="name">
						
						<input formControlName="first" />
						
						<input formControlName="last" />
						
					</fieldset>

					<div [formGroup]="phones">

						<input formControlName="first" />

						<input formControlName="second" />

					</div>

					<fieldset [formGroup]="skill">
						
						<p [formGroup]="language" >

							<input formControlName="firstLanguage" />
							
						</p>
						
					</fieldset>

					<button>Submit</button>

				</form>

			`
		})
		class FormsComponent {

			form: FormGroup;

			constructor(public formBuilder: FormBuilder) {
				this.form = this.formBuilder.group({
					name: this.formBuilder.group({
						first: 'Jane',
						last: 'Doe'
					}),
					phones: this.formBuilder.group({
						first: '911',
						last: '112'
					}),
					skill: this.formBuilder.group({
						language: this.formBuilder.group({
							firstLanguage: 'english'
						})
					})
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

		it('should get values from the form', () => {

			// given
			const fixture = TestBed.createComponent(FormsComponent),
				form = fixture.componentInstance.form;

			// then
			expect(form.get('name').get('first').value).toBe('Jane');
			expect(form.get('name').get('last').value).toBe('Doe');

			expect(form.get('phones').get('first').value).toBe('911');
			expect(form.get('phones').get('last').value).toBe('112');

			expect(form.get('skill').get('language').get('firstLanguage').value).toBe('english');
		});

		it('control should have access to the parent and root control', () => {

			// given
			const fixture = TestBed.createComponent(FormsComponent),
				form = fixture.componentInstance.form;

			// then
			expect(form.get('skill').get('language').get('firstLanguage').root).toBe(form);
			expect(form.get('skill').get('language').get('firstLanguage').parent).toBe(form.get('skill').get('language') as FormGroup);
			expect(form.get('skill').get('language').get('firstLanguage').parent.parent).toBe(form.get('skill') as FormGroup);
		});

	});

});
