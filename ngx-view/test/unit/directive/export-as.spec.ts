import { Component, Directive, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Directive - exportAs -', () => {


	@Directive({
		selector: '[export-dir]',
		exportAs: 'exportRef'
	})
	class ExportDirective {}

	@Component({
		selector: 'test',
		template: `<span export-dir #dirRef="exportRef"></span>`
	})
	class TestComponent {
		@ViewChild(ExportDirective)
		dirRef: ExportDirective;
	}

	it ('should be possible to reference to directive from a node using viewChild', () => {

		// given
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					TestComponent,
					ExportDirective
				]
			});

		const fixture = TestBed.createComponent(TestComponent),
			debug = fixture.debugElement;

		// when
		fixture.detectChanges();

		// then
		expect(fixture.componentInstance.dirRef).toBeDefined();
		expect(fixture.componentInstance.dirRef instanceof ExportDirective).toBe(true);

		const debugElements = debug.queryAll(By.directive(ExportDirective));
		expect(debugElements).toBeDefined();
		expect(debugElements[0].injector.get(ExportDirective)).toBe(fixture.componentInstance.dirRef);
	});

});
