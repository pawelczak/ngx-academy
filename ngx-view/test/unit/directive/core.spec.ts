import { Component, Directive, Input, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Directive -', () => {

	let dirsNumber = 0;

	@Directive({
		selector: '[simple-dir]',
		exportAs: 'simple'
	})
	class SimpleDirective {
		@Input('simple-dir')
		set inputValue(v: string) {
			this.value = v;
		}
		value: string;

		constructor() {
			dirsNumber++;
		}
	}

	@Component({
		selector: 'test',
		template: `
			<div [simple-dir]="'#1'" [simple-dir]="'#2'" #dirRef="simple" ></div>
		`
	})
	class TestComponent {
		@ViewChild('dirRef', { static: true })
		dirRef: SimpleDirective;
	}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					SimpleDirective,
					TestComponent
				]
			});
	});

	/**
	 * One directive per node. When there are two declarations,
	 * the second one is omitted.
	 */
	it ('should create one instance of directive per node', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent);

		// when
		fixture.detectChanges();

		// then
		expect(dirsNumber).toBe(1);
		expect(fixture.componentInstance.dirRef.value).toBe('#1');
	});

});
