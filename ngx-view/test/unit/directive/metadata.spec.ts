import { Component, Directive, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Directives Metadata Properties:
 *
 * - exportAs - name under which the directive instance is exported in a template
 * - host - map of class property to host element bindings for events, properties and
 *   attributes
 * - inputs - list of class property names to data-bind as directive inputs
 * - outputs - list of class property names that expose output events that others can
 *   subscribe to
 * - providers - list of providers available to this directive and its children
 * - queries -  configure queries that can be injected into the directive
 * - selector - css selector that identifies this directive in a template
 */
describe('Directive - metadata -', () => {

	@Directive({
		exportAs: 'metadata',
		host: {} as { [key: string]: string; },
		inputs: [] as Array<string>,
		outputs: [] as Array<string>,
		providers: [] as Array<Provider>,
		queries: {} as { [key: string]: any; },
		selector: 'metadata',
	})
	class MetadataDirective {
	}

	@Component({
		template: `<div metadata></div>`
	})
	class TestComponent {}

	it('should create directive with all the metadata', () => {
		TestBed
			.configureTestingModule({
				declarations: [
					MetadataDirective,
					TestComponent
				]
			});

		expect(() => TestBed.createComponent(TestComponent)).not.toThrowError();
	});

});
