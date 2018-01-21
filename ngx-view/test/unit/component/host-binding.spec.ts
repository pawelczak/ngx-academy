import { Component, HostBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('HostBinding -', () => {

	describe('components host property -', () => {

		@Component({
			selector: '<host>',
			template: ``,
			host: {
				'[class.bound]': 'isBound'
			}
		})
		class HostBindingComponent {

			isBound = true;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostBindingComponent
				]
			});
		});

		it ('should bind attribute to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostBindingComponent);

			// when
			fixture.detectChanges();

			// then
			const classList = fixture.debugElement.nativeElement.classList;

			expect(classList).toContain('bound');
		});

	});

	describe('@HostBinding() -', () => {

		@Component({
			selector: '<host>',
			template: ``
		})
		class HostBindingComponent {

			@HostBinding('class.bound')
			isBound = true;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostBindingComponent
				]
			});
		});

		it ('should bind attribute to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostBindingComponent);

			// when
			fixture.detectChanges();

			// then
			const classList = fixture.debugElement.nativeElement.classList;

			expect(classList).toContain('bound');
		});

	});

});
