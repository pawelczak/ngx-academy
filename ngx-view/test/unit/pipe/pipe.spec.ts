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
		value = 8;
	}

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

		expect(el.textContent.trim()).toBe('9');
	});

});
