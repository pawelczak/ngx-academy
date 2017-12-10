import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

describe('NgPlural -', () => {

	@Component({
		selector: 'ngplural-test',
		template: `<div [ngPlural]="value" >
						<ng-template ngPluralCase="=0" ><p>Zero</p></ng-template>
						<ng-template ngPluralCase="=1" ><p>One</p></ng-template>
						<ng-template ngPluralCase="few" ><p>Few</p></ng-template>
						<ng-template ngPluralCase="other" ><p>Other</p></ng-template>
					</div>`
	})
	class NgPluralTestComponent {
		value = 0;
	}


	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [
					CommonModule
				],
				declarations: [
					NgPluralTestComponent
				]
			})
	});


	it('should render basic list', () => {

		// given
		const fixture = TestBed.createComponent(NgPluralTestComponent),
			componentInst = fixture.componentInstance,
			nativeEl = fixture.debugElement.nativeElement;


		fixture.detectChanges();

		let pTags = nativeEl.querySelectorAll('p');
		expect(pTags[0].textContent.trim()).toBe('Zero');

		componentInst.value = 1;
		fixture.detectChanges();

		pTags = nativeEl.querySelectorAll('p');
		expect(pTags[0].textContent.trim()).toBe('One');

		componentInst.value = 2;
		fixture.detectChanges();

		pTags = nativeEl.querySelectorAll('p');
		expect(pTags[0].textContent.trim()).toBe('Other');
	});

});
