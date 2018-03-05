import { Component, Inject, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * InjectionToken should be used when someone wants to add class/value
 * to the DI context.
 */
describe('InjectionToken -', () => {

	/**
	 * InjectionToken should be used mainly with useValue
	 */
	describe('provider - useValue -', () => {

		const tokenName = 'token',
			token = new InjectionToken(tokenName),
			value = 'Dean Winchester';

		@Component({
			template: ``
		})
		class TestComponent {
			constructor(@Inject(token) public value: any) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent
					],
					providers: [
						{provide: token, useValue: value}
					]
				});
		});

		it('should be possible to provide value with token', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.value).toBe(value);
		});

	});

});
