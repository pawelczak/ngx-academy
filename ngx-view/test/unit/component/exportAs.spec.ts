import { Component, Directive, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component -', () => {

	describe('exportAs -', () => {

		@Directive({
			selector: '[dirOne]',
			exportAs: 'dirOne'
		})
		class DirOneDirective {
		}

		@Component({
			selector: 'export-as,[compOne]',
			template: ``,
			exportAs: 'export,compOne'
		})
		class ExportAsComponent {
		}

		@Component({
			selector: 'wrapper',
			template: `
				<export-as #refOne="export" #refTwo="compOne" #ref ></export-as>
			`
		})
		class TestComponent {

			@ViewChild('refOne')
			refOne: ExportAsComponent;

			@ViewChild('refTwo')
			refTwo: ExportAsComponent;

			@ViewChild('ref')
			ref: ExportAsComponent;

		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						ExportAsComponent,
						DirOneDirective
					]
				});
		});

		it('should be possible to export component as different names', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.refOne instanceof ExportAsComponent).toBeTruthy();
			expect(compInstance.refTwo instanceof ExportAsComponent).toBeTruthy();
			expect(compInstance.ref instanceof ExportAsComponent).toBeTruthy();
			expect(compInstance.ref).toBe(compInstance.refOne);
			expect(compInstance.ref).toBe(compInstance.refTwo);
		});

		it('should be possible to have reference to component and directive on one node', () => {

			// given
			const template = `<div compOne #refOne="compOne" dirOne #refTwo="dirOne" ></div>`;
			TestBed.overrideTemplate(TestComponent, template);

			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.refOne instanceof ExportAsComponent).toBeTruthy();
			expect(compInstance.refTwo instanceof DirOneDirective).toBeTruthy();
			expect(compInstance.refOne).not.toBe(compInstance.refTwo);
		});

	});

});
