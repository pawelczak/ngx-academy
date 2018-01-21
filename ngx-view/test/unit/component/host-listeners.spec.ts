import { Component, HostListener } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('HostListeners -', () => {

	describe('components host property -', () => {

		@Component({
			selector: '<host>',
			template: ``,
			host: {
				'(click)': 'onClick()'
			}
		})
		class HostClickComponent {

			clicked = false;

			onClick() {
				this.clicked = true;
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostClickComponent
				]
			});
		});

		it ('should add event listener to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostClickComponent);

			// when
			fixture.detectChanges();
			fixture.debugElement.triggerEventHandler('click', null);

			// then
			expect(fixture.componentInstance.clicked).toBeTruthy();
		});

	});

	describe('@HostListeners() -', () => {

		@Component({
			selector: '<host>',
			template: ``
		})
		class HostListenerComponent {

			clicked = false;

			@HostListener('click', ['$event'])
			onClick(event: Event) {
				this.clicked = true;
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostListenerComponent
				]
			});
		});

		it ('should add event listener to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostListenerComponent);

			// when
			fixture.detectChanges();
			fixture.debugElement.triggerEventHandler('click', null);

			// then
			expect(fixture.componentInstance.clicked).toBeTruthy();
		});

	});

});
