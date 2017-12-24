import { Component, forwardRef, Inject, InjectionToken, Injector, NgModule, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Injector -', () => {

	const token = new InjectionToken('injector_token');

	@NgModule({
		declarations: [
			forwardRef(() => ParentComponent),
			forwardRef(() => ChildComponent)
		],
		providers: [{
			provide: token,
			useValue: 'root module'
		}]
	})
	class RootModule {}

	@Component({
		selector: 'parent',
		template: `<child></child>`,
		providers: [{
			provide: token,
			useValue: 'parent component'
		}]
	})
	class ParentComponent {
		@ViewChild(forwardRef(() => ChildComponent))
		child: ChildComponent;

		constructor(public injector: Injector,
					@Inject(token) public value: string) {}
	}

	@Component({
		selector: 'child',
		template: ``,
		providers: [{
			provide: token,
			useValue: 'child component'
		}]
	})
	class ChildComponent {
		constructor(public injector: Injector,
					@Inject(token) public value: string) {}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RootModule
			]
		});
	});

	describe('ParentInjector -', () => {

		it ('parent and child should have their own scopes of services', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				parentInst = fixture.componentInstance,
				childInst = parentInst.child;

			// when
			fixture.detectChanges();

			// then
			expect(parentInst.value).toBe('parent component');
			expect(childInst.value).toBe('child component');
		});

		xit ('should be possible to get parent component injector from child level', () => {

			// given
			const fixture = TestBed.createComponent(ParentComponent),
				parentInst = fixture.componentInstance,
				childInst = parentInst.child;

			// when
			fixture.detectChanges();

			// then
			const parentInjector = parentInst.injector,
				childInjector = childInst.injector;

			// expect((childInjector as any).parent.get(token)).toBe(parentInst.injector.get(token));

			//
			// console.log(childInjector.view.root.injector.get(token));
			//
			// expect(childInjector.view.parent.injector.get(token)).toBe('aa');
		});

	});

});