import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component Inheritance - LifecycleHooks -', () => {

	describe('basic', () => {

		class OnInitComponent implements OnInit {

			initialized = false;

			ngOnInit() {
				this.initialized = true;
			}
		}

		@Component({
			template: ``
		})
		class SubOnInitComponent extends OnInitComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubOnInitComponent
				]
			});
		});

		it('should trigger OnInit', () => {

			// given
			const fixture = TestBed.createComponent(SubOnInitComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.initialized).toBeTruthy();
		});

	});


	describe('polymorphism -', () => {

		class OnDestroyComponent implements OnDestroy {

			destroyed = false;

			ngOnDestroy() {
				this.destroyed = true;
			}
		}

		@Component({
			template: ``
		})
		class SubOnDestroyComponent extends OnDestroyComponent {

			ngOnDestroy() {
				// console.log('my destroy');
				super.ngOnDestroy();
			}
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubOnDestroyComponent
				]
			});
		});

		it('should trigger OnDestroy', () => {

			// given
			const fixture = TestBed.createComponent(SubOnDestroyComponent);

			// when
			fixture.destroy();

			// then
			expect(fixture.componentInstance.destroyed).toBeTruthy();
		});
	});
});
