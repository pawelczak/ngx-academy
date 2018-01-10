import { Component, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Pipe -', () => {

	@Pipe({
		name: 'add'
	})
	class TestPipe implements PipeTransform {
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
					TestPipe,
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
			const pipe = new TestPipe();

			// when
			const sum = pipe.transform(0, 1, 2, 3, 4);

			// then
			expect(sum).toEqual(10);
		});

	})

});
