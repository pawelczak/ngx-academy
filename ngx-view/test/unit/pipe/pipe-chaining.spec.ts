import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Pipes - chaining', () => {

	const givenTitle = 'lebron james';

	@Component({
		template: `
			<span class="title">
				{{ title | lowercase | uppercase | titlecase | lowercase }}
			</span>
		`
	})
	class PipeChainComponent {
		title = givenTitle;
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				PipeChainComponent
			]
		})
	});

	fit('should be possible to chain pipes', () => {

		// given
		const fixture = TestBed.createComponent(PipeChainComponent);

		// when
		fixture.detectChanges();

		// then
		const titleEl = fixture.debugElement.query(By.css('.title')).nativeElement;
		expect(titleEl.textContent.trim()).toEqual('Lebron James')

	});

});
