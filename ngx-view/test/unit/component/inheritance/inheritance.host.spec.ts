import { Component, HostBinding, HostListener } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Inheritance Host -', () => {

	describe('HostBinding -', () => {

		const className = 'bat-man';

		class HostBindingComponent {

			@HostBinding('class')
			className: string;
		}

		@Component({
			template: ``
		})
		class InheritedHostBindingComponent extends HostBindingComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					InheritedHostBindingComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(InheritedHostBindingComponent);

			// when
			fixture.componentInstance.className = className;
			fixture.detectChanges();

			// then
			expect(fixture.debugElement.nativeElement.classList).toContain(className);
		});
	});

	describe('HostListener -', () => {

		class HostListenerComponent {

			clicked = false;

			@HostListener('click', ['$event'])
			onClick(event: Event) {
				this.clicked = true;
			}
		}

		@Component({
			template: ``
		})
		class InheritedHostListenerComponent extends HostListenerComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					InheritedHostListenerComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(InheritedHostListenerComponent);
			fixture.detectChanges();

			// when
			fixture.nativeElement.click();

			// then
			expect(fixture.componentInstance.clicked).toBeTruthy();
		});
	});
});
