import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';


xdescribe('Router - routes', () => {

	let location: Location;
	let router: Router;
	let fixture;

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

	it ('navigate to "" redirects you to /list', fakeAsync(() => {

		// when
		router.navigate(['']);
		tick(100);

		// then
		expect(location.path()).toBe('/list');
	}));

	it ('navigate to "search" takes you to /details', fakeAsync(() => {

		// when
		router.navigate(['/details']);
		tick(50);

		// then
		expect(location.path()).toBe('/details');
	}));

});
