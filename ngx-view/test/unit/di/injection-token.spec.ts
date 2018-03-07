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

	class TestClass {}

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

	/**
	 * InjectionToken with useFactory
	 */
	describe('provider - useFactory -', () => {

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent
					],
					providers: [
						{provide: token, useFactory: () => value}
					]
				});
		});

		it('should be possible to use injection token with useFactory', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.value).toBe(value);
		});
	});

	/**
	 * InjectionToken prevents from name clashing.
	 * String based providers doesn't prevent from issues
	 * like name clashing. That is why it's allways better
	 * to use InjectionTokens.
	 */
	describe('name clash -', () => {

		const tokenOne = new InjectionToken(tokenName),
			tokenTwo = new InjectionToken(tokenName);

		const providers = [
			{
				provide: tokenOne,
				useValue: value
			},
			{
				provide: tokenTwo,
				useClass: TestClass
			}
		];

		@Component({
			template: ``
		})
		class NameClashComponent {
			constructor(@Inject(tokenOne) public injectOne: any,
						@Inject(tokenTwo) public injectTwo: any) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						NameClashComponent
					],
					providers: providers
				});
		});

		it('should be possible to use two different InjectionTokens with the same name', () => {

			// given
			const fixture = TestBed.createComponent(NameClashComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			// then
			expect(compInstance.injectOne).toBe(value);
			expect(compInstance.injectTwo instanceof TestClass).toBeTruthy();
		});
	});

});
