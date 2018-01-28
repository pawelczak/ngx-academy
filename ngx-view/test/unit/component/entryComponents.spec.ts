import { Component, ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';


/**
 * Property entryComponents takes an array of components, that can
 * be created dynamically. Same as entryComponents declared in module.
 */
describe('Component - entryComponents -', () => {

	@Component({
		template: ``
	})
	class SimpleComponent {}

	@Component({
		template: ``
	})
	class OtherComponent {}

	@Component({
		template: ``,
		entryComponents: [
			SimpleComponent
		]
	})
	class TestComponent {

		constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

		create(comp: any): void {
			this.componentFactoryResolver.resolveComponentFactory(comp);
			// ...
		}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				SimpleComponent,
				OtherComponent,
				TestComponent
			]
		});
	});

	/**
	 * Component declared in entryComponents of its parent.
	 */
	it ('should create SimpleComponent, because it is declared in entryComponents', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent);

		// when & then
		expect(() => fixture.componentInstance.create(SimpleComponent)).not.toThrow();
	});

	/**
	 * Component not declared in entryComponents of its parent.
	 */
	it ('shouldn\'t create OtherComponent, because it isn\'t declared in entryComponents', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent);

		// when & then
		expect(() => fixture.componentInstance.create(OtherComponent)).toThrow();
	});

});
