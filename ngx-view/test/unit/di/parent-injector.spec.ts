import { Component, forwardRef, Host, Injectable, InjectionToken, Injector, SkipSelf, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Testing methods for getting parent injector.
 */
describe('Parent injector -' , () => {

	const token = new InjectionToken('token');

	@Component({
		selector: 'parent',
		template: `
			<child></child>
		`,
		providers: [
			{provide: token, useValue: 'parent'}
		]
	})
	class ParentComponent {
		@ViewChild(forwardRef(() => ChildComponent))
		childRef: ChildComponent;

		constructor(public injector: Injector) {}
	}

	@Component({
		selector: 'child',
		template: ``,
		providers: [
			{provide: token, useValue: 'child'}
		]
	})
	class ChildComponent {
		constructor(public injector: Injector,
					@SkipSelf() public parentInjectorBySkipSelf: Injector,
					@Host() public parentInjectorByHost: Injector) {}
	}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				declarations: [
					ParentComponent,
					ChildComponent
				]
			});
	});

	/**
	 * Using @SkipSelf() allows to get injector of a parent
	 */
	it ('should be possible to get parent injector with @SkipSelf() decorator', () => {

		// given
		const fixture = TestBed.createComponent(ParentComponent),
			parent = fixture.componentInstance;

		// when
		fixture.detectChanges();

		// then
		const child = parent.childRef;

		expect(child.injector.get(token)).toBe('child');
		expect(child.parentInjectorBySkipSelf.get(token)).toBe('parent');
	});

	/**
	 * @Host() doesn't work
	 */
	it ('is not possible to get parent injector using @Host() decorator', () => {

		// given
		const fixture = TestBed.createComponent(ParentComponent),
			parent = fixture.componentInstance;

		// when
		fixture.detectChanges();

		// then
		const child = parent.childRef;

		expect(child.injector.get(token)).toBe('child');
		expect(child.parentInjectorByHost.get(token)).not.toBe('parent');
	});

});
