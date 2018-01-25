import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('Router - routes', () => {

	let location: Location;
	let router: Router;
	let fixture: ComponentFixture<any>;

	@Component({
		template: `List`
	})
	class ListComponent {}

	@Component({
		template: `Details`
	})
	class DetailsComponent {}

	@Component({
		template: `
			<router-outlet></router-outlet>
		`
	})
	class AppComponent {}

	const routes: Routes = [
		{path: '', redirectTo: 'list', pathMatch: 'full'},
		{path: 'list', component: ListComponent},
		{path: 'details', component: DetailsComponent}
	];

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes(routes)
				],
				declarations: [
					ListComponent,
					DetailsComponent,
					AppComponent
				]
			});

		router = TestBed.get(Router);
		location = TestBed.get(Location);

		fixture = TestBed.createComponent(AppComponent);
		router.initialNavigation();
	});

	/**
	 * Testing with 'done' method
	 */
	it ('navigate to "" redirects you to /list', (done) => {

		// when
		router
			.navigate([''])
			.then(() => {

				// then
				expect(location.path()).toBe('/list');
				done();
			});
	});

	/**
	 * fakeAsync doesn't work
	 */
	xit ('navigate to "search" takes you to /details', fakeAsync(() => {

		// when
		router.navigate(['/details']);

		fixture.detectChanges();
		tick(5000);

		// then
		expect(location.path()).toBe('/details');
	}));

	/**
	 * (async) method works
	 */
	it ('can navigate to details with method (async)', async(() => {
		router
			.navigate(['/details'])
			.then(() => {
				expect(location.path()).toBe('/details');
			});
	}));

});
