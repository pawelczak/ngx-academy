import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('Router', () => {

	@Component({
		selector: 'basic-router',
		template: `
		<p id="basic-router"></p>
		`
	})
	class BasicRouterComponent {}

	@Component({
		selector: 'routing',
		template: `
			
			<a routerLink="/basic" id="nav-basic-router"></a>

			<router-outlet></router-outlet>
		`
	})
	class RoutingComponent {}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([
					{ path: 'basic', component: BasicRouterComponent }
				])
			],
			declarations: [
				RoutingComponent,
				BasicRouterComponent
			]
		});
	});


	describe('routerLink -', () => {

		it ('should be possible to select route using routerLink',
			inject([Router, Location], (router: Router, location: Location) => {

			const fixture = TestBed.createComponent(RoutingComponent),
				compInstance = fixture.componentInstance,
				el = fixture.nativeElement;

			fixture.detectChanges();

			// when
			el.querySelectorAll('#nav-basic-router')[0].click();

			// then
			expect(document.getElementById('#basic-router')).not.toBeNull();

		}));

	});


});