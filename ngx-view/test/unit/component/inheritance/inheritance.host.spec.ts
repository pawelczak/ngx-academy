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
		class SubHostBindingComponent extends HostBindingComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubHostBindingComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(SubHostBindingComponent);

			// when
			fixture.componentInstance.className = className;
			fixture.detectChanges();

			// then
			const cssClassList = fixture.debugElement.nativeElement.classList;

			expect(cssClassList).toContain(className);
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
		class SubHostListenerComponent extends HostListenerComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubHostListenerComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(SubHostListenerComponent);
			fixture.detectChanges();

			// when
			fixture.nativeElement.click();

			// then
			expect(fixture.componentInstance.clicked).toBeTruthy();
		});
	});
});
