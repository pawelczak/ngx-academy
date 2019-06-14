import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BaseComponent } from './base-component';
import { BaseComponentProperties } from './base-component-properties';


describe('@BaseComponent -', () => {

	const givenHero = 'Bruce Wayne';

	// @BaseComponent({
	@Component(new BaseComponentProperties({
		selector: 'generic-component',
		styles: [`
			div {
				color: red;
			}
		`],
		template: `

			<div>{{hero}}</div>
		`
	}))
	class BaseComponentTest {

		hero = givenHero;
	}

	@Component({
		template: `
			<generic-component></generic-component>
		`
	})
	class TestComponent {}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				BaseComponentTest
			]
		});
	});

	it('should disable changeDetection', () => {

		// given
		const fixture = TestBed.createComponent(BaseComponentTest);

		fixture.detectChanges();

		// when
		fixture.componentInstance.hero = 'Clark Kent';
		fixture.detectChanges();

		// then
		const heroText = fixture.debugElement.query(By.css('div')).nativeElement.textContent.trim();

		expect(heroText).toEqual(givenHero);
	});

	it('should disable view encapsulation', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent),
			el = fixture.nativeElement.querySelector('generic-component');

		// when
		fixture.detectChanges();

		// then
		const div = el.querySelector('div');

		expect(el.getAttribute('_nghost-c1')).toBeNull('Component tag');
		expect(div.getAttribute('_ngcontent-c1')).toBeNull('div tag');
	});

});
