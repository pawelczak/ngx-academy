import { ChangeDetectionStrategy, Component, Provider, Type, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Metadata Properties:**
 *
 * - animations - list of animations of this component
 * - changeDetection - change detection strategy used by this component
 * - encapsulation - style encapsulation strategy used by this component
 * - entryComponents - list of components that are dynamically inserted into the view of this
 *   component
 * - exportAs - name under which the component instance is exported in a template
 * - host - map of class property to host element bindings for events, properties and
 *   attributes
 * - inputs - list of class property names to data-bind as component inputs
 * - interpolation - custom interpolation markers used in this component's template
 * - moduleId - ES/CommonJS module id of the file in which this component is defined
 * - outputs - list of class property names that expose output events that others can
 *   subscribe to
 * - preserveWhitespaces
 * - providers - list of providers available to this component and its children
 * - queries -  configure queries that can be injected into the component
 * - selector - css selector that identifies this component in a template
 * - styleUrls - list of urls to stylesheets to be applied to this component's view
 * - styles - inline-defined styles to be applied to this component's view
 * - template - inline-defined template for the view
 * - templateUrl - url to an external file containing a template for the view
 * - viewProviders - list of providers available to this component and its view children
 */
describe('Component - metadata -', () => {

	@Component({
		animations: [] as Array<any>,
		changeDetection: ChangeDetectionStrategy.Default,
		encapsulation: ViewEncapsulation.Emulated,
		entryComponents: [] as Array<Type<any> | any[]>,
		exportAs: 'metadata',
		host: {} as { [key: string]: string; },
		inputs: [] as Array<string>,
		interpolation: ['{{', '}}'],
		moduleId: '',
		outputs: [] as Array<string>,
		preserveWhitespaces: true,
		providers: [] as Array<Provider>,
		queries: {} as { [key: string]: any; },
		selector: 'metadata',
		// styleUrls: [] as Array<string>,
		styles: [] as Array<string>,
		template: ``,
		// templateUrl: '',
		viewProviders: [] as Array<Provider>
	})
	class MetadataComponent {}

	it('should have all the metadata', () => {
		TestBed
			.configureTestingModule({
				declarations: [
					MetadataComponent
				]
			});

		expect(() => TestBed.createComponent(MetadataComponent)).not.toThrowError();
	});

});

