import { Component, Directive, forwardRef, Injector, Self, StaticProvider, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('ForwardRef -', () => {

	/**
	 * Declare class providers before class has been declared
	 */
	it ('basic example', () => {

		// given
		const providers = [
			{
				provide: forwardRef(() => Car),
				deps: []
			} as StaticProvider
		];

		class Car {}

		// when
		const injector = Injector.create(providers);

		// then
		expect(injector.get(Car)).toBeDefined();
	});

	/**
	 * Providers for directive are created before the directive is declared.
	 * Using forwardRef lets you declare Directive as a provider before it is used.
	 *
	 * Than other directive can inject reference to the first one using di.
	 * This works because directives created on same node share injector (View)
	 */
	it ('should be possible to inject directive as its own dependency', () => {

		// given
		class ForwardedDirectiveRef {}

		const providers = [{
			provide: ForwardedDirectiveRef,
			useExisting: forwardRef(() => ForwardedDirective)
		}];

		@Directive({
			selector: '[forwarded]',
			exportAs: 'dirRef',
			providers: providers
		})
		class ForwardedDirective {
			value = 'Forward directive';
		}

		@Directive({
			selector: '[catch]',
			exportAs: 'catchRef'
		})
		class CatchDirective {
			constructor(@Self() public forwardedDirectiveRef: ForwardedDirectiveRef) {}
		}

		@Component({
			selector: 'test',
			template: `<span forwarded #dirRef="dirRef" catch #catchRef="catchRef" ></span>`
		})
		class TestComponent {
			@ViewChild(ForwardedDirective)
			dirRef: ForwardedDirective;

			@ViewChild(CatchDirective)
			catchRef: CatchDirective;
		}

		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					ForwardedDirective,
					CatchDirective,
					TestComponent
				],
				providers: []
			});

		const fixture = TestBed.createComponent(TestComponent),
			compInstance = fixture.componentInstance;

		// when
		fixture.detectChanges();

		// then
		expect(compInstance.dirRef).toBeDefined();
		expect(compInstance.catchRef).toBeDefined();
		expect((compInstance.catchRef.forwardedDirectiveRef as ForwardedDirective).value).toBe('Forward directive');
		expect(compInstance.catchRef.forwardedDirectiveRef).toBe(compInstance.dirRef);
	});

});
