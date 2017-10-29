import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Injector, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Dependency Injection -', () => {


	describe('component -', () => {

		@Component({
			selector: 'di',
			template: ``
		})
		class InjectComponent {

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public changeDetectionRef: ChangeDetectorRef) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InjectComponent
					]
				});
		});


		it ('should have all native services injected', () => {

			// when
			const fixture = TestBed.createComponent(InjectComponent),
				compInstance = fixture.componentInstance;

			// then
			expect(compInstance.applicationRef).toBeDefined();
			expect(compInstance.elementRef).toBeDefined();
			expect(compInstance.viewContainerRef).toBeDefined();
			expect(compInstance.injector).toBeDefined();
			expect(compInstance.changeDetectionRef).toBeDefined();
		});

	});

});
