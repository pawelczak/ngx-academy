import { Component, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Pipe -', () => {

	@Pipe({
		name: 'add',
		pure: true
	})
	class CounterPipe implements PipeTransform {
		transform(value: any, ...args: any[]): any {
			if (!args || args.length < 1) {
				return value;
			}

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

		it ('should be possible to use pipes with no arguments', () => {

			// given
			const template = `
					<p>
						{{value | add }}
					</p>
			`;
			TestBed.overrideTemplate(TestComponent, template);
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const el = fixture.nativeElement.querySelector('p');

			expect(el.textContent.trim()).toBe('0');
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

		class Counter {
			static instanceNumber: number = 0;

			constructor() {
				Counter.instanceNumber++;
			}
		}

		describe('pure pipe -', () => {

			@Pipe({
				name: 'pure',
				pure: true
			})
			class PurePipe extends Counter implements PipeTransform {
				constructor() {
					super();
				}
				transform(value: any, ...args: any[]): any {
					return 'pure';
				}
			}

			@Component({
				selector: 'child',
				template: `
					{{ 'hello' | pure }}
				`
			})
			class ChildComponent {}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						PurePipe,
						TestComponent,
						ChildComponent
					]
				});
			});

			it ('should create one instance of pipe per component', () => {

				// given
				Counter.instanceNumber = 0; // reset number of instances

				const templ = `
					{{ 'one' | pure }}
					{{ 'two' | pure }}
					{{ 'three' | pure }}
				`;
				TestBed.overrideTemplate(TestComponent, templ);
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				expect(Counter.instanceNumber).toEqual(1);
			});

			it ('should create one instances of pipe, one for each component and its children', () => {

				// given
				Counter.instanceNumber = 0; // reset number of instances

				const templ = `
					{{ 'one' | pure }}
					{{ 'two' | pure }}
					{{ 'three' | pure }}
					<child></child>
					<child></child>
				`;
				TestBed.overrideTemplate(TestComponent, templ);
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				expect(Counter.instanceNumber).toEqual(3);
			});

		});

		describe('impure pipe -', () => {

			@Pipe({
				name: 'impure',
				pure: false
			})
			class PurePipe extends Counter implements PipeTransform {
				constructor() {
					super();
				}
				transform(value: any, ...args: any[]): any {
					return 'impure';
				}
			}

			@Component({
				selector: 'child',
				template: `
					{{ 'hello' | impure }}
				`
			})
			class ChildComponent {}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						PurePipe,
						TestComponent,
						ChildComponent
					]
				});
			});

			it ('should create one instance of pipe for each use component', () => {

				// given
				Counter.instanceNumber = 0; // reset number of instances

				const templ = `
					{{ 'one' | impure }}
					{{ 'two' | impure }}
					{{ 'three' | impure }}
				`;
				TestBed.overrideTemplate(TestComponent, templ);
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				expect(Counter.instanceNumber).toEqual(3);
			});

			it ('should create instances of pipe for each use in a component and its children', () => {

				// given
				Counter.instanceNumber = 0; // reset number of instances

				const templ = `
					{{ 'one' | impure }}
					{{ 'two' | impure }}
					{{ 'three' | impure }}
					<child></child>
					<child></child>
				`;
				TestBed.overrideTemplate(TestComponent, templ);
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				expect(Counter.instanceNumber).toEqual(5);
			});

		});

	});

});
