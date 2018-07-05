import { Component, Injector, Inject, ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 *
 * POC - NEED TO IMPROVE THIS
 *
 * Create dynamic component with projected nodes.
 */
xdescribe('ComponentFactoryResolver -', () => {

	@Component({
		selector: 'simple',
		template: `simple`
	})
	class SimpleComonent {
	}

	@Component({
		template: `
			<div>Dynamic</div>
			<div class="content">
				<ng-content></ng-content>
			</div>
		`
	})
	class DynamicComponent {
	}

	@Component({
		selector: 'wrapper',
		template: ``
	})
	class WrapperComponent {

		constructor(@Inject(DOCUMENT) private document: any,
					private applicationRef: ApplicationRef,
					private componentFactoryResolver: ComponentFactoryResolver,) {
		}

		create(): void {
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);

			const injector: Injector = Injector.create({providers: []});

			const componentRef = componentFactory.create(injector);

			this.applicationRef.attachView(componentRef.hostView);
		}

	}

	@Component({
		template: `

			<wrapper>
				<simple></simple>
			</wrapper>

		`
	})
	class TestComponent {
	}


	describe('', () => {


	});


});
