import {
	ApplicationRef, ChangeDetectorRef, Component, Directive, ElementRef, Injector, Renderer2, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Dependency Injection -', () => {

	describe('Component -', () => {

		@Component({
			selector: 'di-component',
			template: `

				<ng-template></ng-template>
			`
		})
		class InjectComponent {

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public parentInjector: Injector,
				public renderer: Renderer2,
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

			// given
			const fixture = TestBed.createComponent(InjectComponent),
				compInstance = fixture.componentInstance;

			// when & then
			expect(compInstance.applicationRef).toBeDefined();
			expect(compInstance.elementRef).toBeDefined();
			expect(compInstance.viewContainerRef).toBeDefined();
			expect(compInstance.injector).toBeDefined();
			expect(compInstance.parentInjector).toBeDefined();
			expect(compInstance.renderer).toBeDefined();
			expect(compInstance.changeDetectionRef).toBeDefined();
		});

	});

	describe('Directive -', () => {

		@Directive({
			selector: '[di-directive]',
			exportAs: 'dirRef'
		})
		class InjectDirective {

			constructor(
				public applicationRef: ApplicationRef,
				public elementRef: ElementRef,
				public viewContainerRef: ViewContainerRef,
				public injector: Injector,
				public parentInjector: Injector,
				public renderer: Renderer2,
				public changeDetectionRef: ChangeDetectorRef) {}

			methodOnDirective() {}
		}

		@Component({
			selector: 'test-di-directive',
			template: `
				<div di-directive #dirRef="dirRef" >
				</div>
			`
		})
		class TestInjectDirectiveComponent {
			@ViewChild('dirRef')
			dirRef: InjectDirective;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						InjectDirective,
						TestInjectDirectiveComponent
					]
				});
		});

		it ('should have all native services injected', () => {

			// given
			const fixture = TestBed.createComponent(TestInjectDirectiveComponent),
				testCompInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(testCompInstance.dirRef.applicationRef).toBeDefined();
			expect(testCompInstance.dirRef.elementRef).toBeDefined();
			expect(testCompInstance.dirRef.viewContainerRef).toBeDefined();
			expect(testCompInstance.dirRef.injector).toBeDefined();
			expect(testCompInstance.dirRef.parentInjector).toBeDefined();
			expect(testCompInstance.dirRef.changeDetectionRef).toBeDefined();
			expect(testCompInstance.dirRef.renderer).toBeDefined();
			expect(testCompInstance.dirRef.methodOnDirective).toBeDefined();
		});

	});


});
