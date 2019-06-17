import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Component Inheritance - Metadata -', () => {

	const givenValue = 'Bruce Wayne';

	@Component({
		selector: 'base',
		template: `
				<div>
					${givenValue}
				</div>
			`,
		styles: [`
				div {
					color: red;
				}
			`],
		encapsulation: ViewEncapsulation.None
	})
	abstract class BaseComponent {
	}

	describe('abstract -', () => {

		class MyComponent extends BaseComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					MyComponent
				]
			});
		});

		it('should inherited inputs', () => {

			// given
			const fixture = TestBed.createComponent(MyComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.query(By.css('div')).nativeElement.textContent.trim();
			expect(text).toEqual(givenValue);

			const div = fixture.nativeElement.querySelector('div');
			expect(div.getAttribute('_ngcontent-c0')).toBeNull('div tag');
		});
	});



	describe('selector -', () => {

		@Component({
			selector: 'my-comp',
			template: `
				<span>
					${givenValue}
				</span>
			`
		})
		class MyComponent extends BaseComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					MyComponent
				]
			});
		});

		it('should inherited inputs', () => {

			// given
			const fixture = TestBed.createComponent(MyComponent);

			// when
			fixture.detectChanges();

			// then
			const text = fixture.debugElement.query(By.css('span')).nativeElement.textContent.trim();
			expect(text).toEqual(givenValue);

			const div = fixture.nativeElement.querySelector('span');
			expect(div.getAttribute('_ngcontent-c0')).toBeNull('span tag');
		});
	});

});
