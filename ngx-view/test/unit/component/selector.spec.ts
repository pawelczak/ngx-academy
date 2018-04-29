import { Component, Input, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Different methods of declaring components
 */
describe('Component - selector -', () => {

	describe('basic -', () => {

		const componentContent = 'Basic component';

		@Component({
			selector: '[basic],basic',
			template: `
				<h1>${componentContent}</h1>
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
				
				<p basic="bar" #compFourRef class="four"></p>
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
			expect(fixture.nativeElement.querySelector('basic h1').textContent).toBe(componentContent);
			expect(compInstance.compOneRef).toBeDefined();
			expect(compInstance.compOneRef instanceof BasicComponent).toBe(true);
		});

		it ('should be possible to declare component like "<div basic ></div>" ', () => {

			// then
			expect(fixture.nativeElement.querySelector('div')).toBeDefined();
			expect(fixture.nativeElement.querySelector('div h1').textContent).toBe(componentContent);
			expect(compInstance.compTwoRef).toBeDefined();
			expect(compInstance.compTwoRef instanceof BasicComponent).toBe(true);
		});

		it ('should be possible to declare component like "<div [basic]="\'value\'" ></div>" ', () => {

			// then
			expect(fixture.nativeElement.querySelector('p')).toBeDefined();
			expect(fixture.nativeElement.querySelector('p h1').textContent).toBe(componentContent);
			expect(compInstance.compThreeRef).toBeDefined();
			expect(compInstance.compThreeRef instanceof BasicComponent).toBe(true);
			expect(compInstance.compThreeRef.value).toBe('foo');
		});

		it ('should be possible to declare component like "<div basic="value" ></div>" ', () => {

			// then
			expect(fixture.nativeElement.querySelector('p.four')).toBeDefined();
			expect(fixture.nativeElement.querySelector('p.four h1').textContent).toBe(componentContent);
			expect(compInstance.compFourRef).toBeDefined();
			expect(compInstance.compFourRef instanceof BasicComponent).toBe(true);
			expect(compInstance.compFourRef.value).toBe('bar');
		});

	});

	describe('complex selectors -', () => {

		const componentContent = 'Complex component';

		@Component({
			selector: 'p[complex],input:not(type="checkbox")[complexInput]',
			template: `
				<h1>${componentContent}</h1>
			`
		})
		class ComplexSelectorComponent {}

		@Component({
			selector: 'test',
			template: `
				<p #compOneRef complex ></p>
			`
		})
		class TestComponent {
			@ViewChild('compOneRef')
			compOneRef: ComplexSelectorComponent;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ComplexSelectorComponent,
						TestComponent
					]
				});
		});

		it ('should possible to declare selector for specific HTML tag', () => {

			// given
			TestBed.overrideTemplate(TestComponent, `<p #compOneRef complex ></p>`)
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.nativeElement.querySelector('p h1').textContent).toBe(componentContent);
		});

		it ('should not be possible to use component for not declared selector', () => {

			// given
			TestBed.overrideTemplate(TestComponent, `<h2 #compOneRef complex ></h2>`)
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.nativeElement.querySelector('h2 h1')).toBeNull();
		});

		it ('should work for declare tag & type', () => {

			TestBed.overrideTemplate(TestComponent, `<input type="text" #compOneRef complexInput />`)
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.nativeElement.querySelector('input h1').textContent).toBe(componentContent);
		});

		/**
		 * This doesn't work
		 */
		xit ('should work for declare tag & type', () => {

			TestBed.overrideTemplate(TestComponent, `<input type="checkbox" #compOneRef complexInput />`)
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.nativeElement.querySelector('input h1')).toBeNull();
		});

	});

});
