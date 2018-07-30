import { Component, Injectable, NgModule, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Services - ngOnDestroy -', () => {

	@Injectable()
	class Service implements OnDestroy {

		ngOnDestroy() {
		}
	}

	/**
	 * Provided at the component level.
	 * It makes component to work at the component context,
	 * so each time component is created, a new instance of
	 * the service is also created.
	 */
	describe('provided at the component level -', () => {

		@Component({
			template: ``,
			providers: [
				Service
			]
		})
		class MultiInstanceComponent {
			constructor(public service: Service) {
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					MultiInstanceComponent
				]
			});
		});

		it('should trigger services ngOnDestroy', () => {

			// given
			const fixture = TestBed.createComponent(MultiInstanceComponent),
				compInstance = fixture.componentInstance;

			spyOn(compInstance.service, 'ngOnDestroy').and.callThrough();

			// when
			fixture.destroy();

			// then
			expect(compInstance.service.ngOnDestroy).toHaveBeenCalled();
		});
	});

	/**
	 * Provided at the module level.
	 * That makes service a singleton.
	 */
	describe('singleton -', () => {

		@Component({
			template: ``
		})
		class SingletonComponent {
			constructor(public service: Service) {
			}
		}

		@NgModule({
			providers: [
				Service
			]
		})
		class ModuleWithSingleton {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					ModuleWithSingleton
				],
				declarations: [
					SingletonComponent
				]
			});
		});

		it('should not trigger services ngOnDestroy', () => {

			// given
			const fixture = TestBed.createComponent(SingletonComponent),
				compInstance = fixture.componentInstance;

			spyOn(compInstance.service, 'ngOnDestroy').and.callThrough();

			// when
			fixture.destroy();

			// then
			expect(compInstance.service.ngOnDestroy).not.toHaveBeenCalled();
		});

	});

});
