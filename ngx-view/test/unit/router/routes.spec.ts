import { Component, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('Router - routes', () => {

	let location: Location;
	let router: Router;
	let fixture: ComponentFixture<any>;

	@Component({
		selector: 'list',
		template: `List`
	})
	class ListComponent {
	}

	@Component({
		selector: 'details',
		template: `Details`
	})
	class DetailsComponent {
	}

	@Component({
		template: `
			<router-outlet></router-outlet>
		`
	})
	class AppComponent {
	}


	/**
	 * Router direct to the specific components.
	 */
	describe('component path -', () => {

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
		it('navigate to "" redirects you to /list', (done) => {

			// when
			router
				.navigate([''])
				.then(() => {

					// then
					expect(location.path()).toBe('/list');

					const listElement = fixture.debugElement.query(By.css('list'));
					expect(listElement).not.toBeNull();
					done();
				});
		});

		/**
		 * fakeAsync doesn't work
		 */
		xit('navigate to "search" takes you to /details', fakeAsync(() => {

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
		it('can navigate to details with method (async)', async(() => {

			// when
			router
				.navigate(['/details'])
				.then(() => {

					// then
					expect(location.path()).toBe('/details');

					const detailsEl = fixture.debugElement.query(By.css('details'));
					expect(detailsEl).not.toBeNull();
				});
		}));

	});


	/**
	 * Router directs to the module
	 */
	describe('loadChildren -', () => {

		const listModuleRoutes = [
			{path: '', component: ListComponent},
			{path: 'details', component: DetailsComponent}
		];

		@NgModule({
			imports: [
				RouterModule.forChild(listModuleRoutes)
			],
			declarations: [
				ListComponent,
				DetailsComponent
			]
		})
		class ChildrenModule {
		}

		const routes: Routes = [
			{path: '', loadChildren: () => ChildrenModule}
		];


		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						RouterTestingModule.withRoutes(routes)
					],
					declarations: [
						AppComponent
					]
				});

			router = TestBed.get(Router);
			location = TestBed.get(Location);

			fixture = TestBed.createComponent(AppComponent);
			router.initialNavigation();
		});

		it ('should navigate to the default path', (done) => {

			// when
			router
				.navigate([''])
				.then(() => {

					// then
					expect(location.path()).toBe('/');

					const listElement = fixture.debugElement.query(By.css('list'));
					expect(listElement).not.toBeNull();
					done();
				});

		});

		it ('should navigate to more specific path', (done) => {

			// when
			router
				.navigate(['/details'])
				.then(() => {

					// then
					expect(location.path()).toBe('/details');

					const detailsElement = fixture.debugElement.query(By.css('details'));
					expect(detailsElement).not.toBeNull();
					done();
				});

		});

	});

});
