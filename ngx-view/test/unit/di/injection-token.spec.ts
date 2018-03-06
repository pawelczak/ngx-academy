import { Component, Inject, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * InjectionToken should be used:
 *
 * "Whenever the type you are injecting is not reified (does not have a
 * runtime representation)"
 *
 */
describe('InjectionToken -', () => {

	const tokenName = 'token',
		token = new InjectionToken(tokenName),
		value = 'Dean Winchester';

	@Component({
		template: ``
	})
	class TestComponent {
		constructor(@Inject(token) public value: any) {}
	}

	/**
	 * InjectionToken should be used mainly with useValue
	 */
	describe('provider - useValue -', () => {

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

	/**
	 * InjectionToken with useClass
	 */
	describe('provider - useClass -', () => {

		class TestClass {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent
					],
					providers: [
						{provide: token, useClass: TestClass}
					]
				});
		});

		it('should be possible to use injection token with useClass', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.value).toBeDefined();
			expect(compInstance.value instanceof TestClass).toBeTruthy();
		});
	});

	/**
	 * InjectionToken with useExisting
	 */
	describe('provider - useExisting -', () => {

		class TestClass {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent
					],
					providers: [
						TestClass,
						{provide: token, useExisting: TestClass}
					]
				});
		});

		it('should be possible to use injection token with useExisting', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.value).toBeDefined();
			expect(compInstance.value instanceof TestClass).toBeTruthy();
		});
	});

});
