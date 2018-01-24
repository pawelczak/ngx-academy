import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';


describe('Component - interpolation -', () => {

	@Component({
		selector: 'inter',
		template: `
		
			<div>START 1 + 1 END</div>
		
		`,
		interpolation: ['START', 'END']
	})
	class InterComponent {}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					InterComponent
				]
			});
	});

	it ('should change default interpolation signs', () => {

		// given
		const fixture = TestBed.createComponent(InterComponent);

		// when
		fixture.detectChanges();

		// then
		const div = fixture.debugElement.query(By.css('div')).nativeElement;

		expect(div.textContent).toBe('2');
	});
});
