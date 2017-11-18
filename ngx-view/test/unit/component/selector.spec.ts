import { Component, Input, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Component - selector -', () => {

	@Component({
		selector: '[basic],basic',
		template: `
			<p>Flexible component</p>
		`
	})
	class BasicComponent {
		@Input('basic')
		value: any;
	}

	@Component({
		selector: 'test',
		template: `
		
			<basic #compOneRef ></basic>
			
			<div basic #compTwoRef ></div>

			<p [basic]="'foo'" #compThreeRef ></p>
			
			<p basic="bar" #compFourRef ></p>
			
		`
	})
	class TestComponent {

		@ViewChild('compOneRef')
		compOneRef: BasicComponent;

		@ViewChild('compTwoRef')
		compTwoRef: BasicComponent;

		@ViewChild('compThreeRef')
		compThreeRef: BasicComponent;

		@ViewChild('compFourRef')
		compFourRef: BasicComponent;

	}

	let fixture: any,
		compInstance: any;

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					BasicComponent,
					TestComponent
				]
			});
		 fixture = TestBed.createComponent(TestComponent);
		 compInstance = fixture.componentInstance;
		 fixture.detectChanges();
	});

	it ('should be possible to declare component like "<basic></basic>" ', () => {

		// then
		expect(fixture.nativeElement.querySelector('basic')).toBeDefined();
		expect(compInstance.compOneRef).toBeDefined();
		expect(compInstance.compOneRef instanceof BasicComponent).toBeDefined();
	});

	it ('should be possible to declare component like "<div basic ></div>" ', () => {

		// then
		expect(fixture.nativeElement.querySelector('div')).toBeDefined();
		expect(compInstance.compTwoRef).toBeDefined();
		expect(compInstance.compTwoRef instanceof BasicComponent).toBeDefined();
	});

	it ('should be possible to declare component like "<div [basic]="\'value\'" ></div>" ', () => {

		// then
		expect(fixture.nativeElement.querySelector('p')).toBeDefined();
		expect(compInstance.compThreeRef).toBeDefined();
		expect(compInstance.compThreeRef instanceof BasicComponent).toBeDefined();
		expect(compInstance.compThreeRef.value).toBe('foo');
	});

	it ('should be possible to declare component like "<div basic="value" ></div>" ', () => {

		// then
		expect(fixture.nativeElement.querySelector('p')).toBeDefined();
		expect(compInstance.compFourRef).toBeDefined();
		expect(compInstance.compFourRef instanceof BasicComponent).toBeDefined();
		expect(compInstance.compFourRef.value).toBe('bar');
	});

	describe('complex selectors -', () => {});

});