import { Component, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Pipe -', () => {

	@Pipe({
		name: 'add'
	})
	class CounterPipe implements PipeTransform {

		static instanceNumber: number = 0;

		constructor() {
			CounterPipe.instanceNumber++;
		}

		transform(value: any, ...args: any[]): any {
			return value + args.reduce((prev, cur) => {return prev + cur;});
		}
	}

	@Component({
		selector: 'test',
		template: `
			<p>
				{{value | add:1 }}
			</p>
		`
	})
	class TestComponent {
		value = 0;
	}

	describe('template use-', () => {

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					CounterPipe,
					TestComponent
				]
			});
		});

		it ('should be possible to use pipes in template', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.nativeElement.querySelector('p');

			expect(el.textContent.trim()).toBe('1');
		});

		it ('should be possible to use pipes with multiple arguments', () => {

			// given
			const template = `
					<p>
						{{value | add:1:2:3:4 }}
					</p>
			`;
			TestBed.overrideTemplate(TestComponent, template);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.nativeElement.querySelector('p');

			expect(el.textContent.trim()).toBe('10');
		});

	});

	describe('object use -', () => {

		it ('should be possible to use pipe as an object', () => {

			// given
			const pipe = new CounterPipe();

			// when
			const sum = pipe.transform(0, 1, 2, 3, 4);

			// then
			expect(sum).toEqual(10);
		});

	});

	describe('multiple instances -', () => {

		@Component({
			selector: 'child',
			template: `
				{{ 8 | add:1 }}
			`
		})
		class ChildComponent {}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					CounterPipe,
					TestComponent,
					ChildComponent
				]
			});
		});

		it ('should create one instance of pipe for each use in component template', () => {

			// given
			CounterPipe.instanceNumber = 0; // reset number of instances

			const templ = `
				{{value | add:1}}
				{{value | add:2}}
				{{value | add:3}}
			`;
			TestBed.overrideTemplate(TestComponent, templ);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(CounterPipe.instanceNumber).toEqual(1);
		});

		it ('should create two instances of pipes, one for each component', () => {

			// given
			CounterPipe.instanceNumber = 0; // reset number of instances

			const templ = `
				{{value | add:1}}
				{{value | add:2}}
				{{value | add:3}}
				<child></child>
				<child></child>
			`;
			TestBed.overrideTemplate(TestComponent, templ);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(CounterPipe.instanceNumber).toEqual(3);
		});

	})

});
