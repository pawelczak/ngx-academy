import { Component, HostBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';


/**
 * HostBinding / "host meta" allows to assign values to host element.
 * The types of "things", that can be assigned:
 * - class (takes string, assign any class)
 * - class.className (takes boolean, assign specific class)
 * - style.styleName (takes string value, assign value to styleName)
 * - attr.attributeName (takes string value, assign value to attribute)
 * - property (e.g. [id]='randomId')
 */
describe('HostBinding -', () => {

	const color = 'purple',
		className = 'Dean',
		attrKey = 'name',
		attrValue = 'Winchester',
		propertyKey = 'id',
		propertyValue = 'Colt';

	function assertHostBindings(nativeElement: any) {

		const actualClassList = nativeElement.classList,
			actualStyleColor = nativeElement.style.color,
			actualAttrKey = nativeElement.getAttribute(attrKey),
			actualIdValue = nativeElement.getAttribute(propertyKey);

		expect(actualClassList).toContain('bound');
		expect(actualClassList).toContain(className);
		expect(actualStyleColor).toEqual(color);
		expect(actualAttrKey).toEqual(attrValue);
		expect(actualIdValue).toEqual(propertyValue);
	}

	describe('components host property -', () => {

		@Component({
			selector: '<host>',
			template: ``,
			host: {
				'[class]': 'className',
				'[class.bound]': 'isBound',
				'[style.color]': 'styleColor',
				'[attr.name]': 'attrValue',
				'[id]': 'propertyValue' // <-- property binding
			}
		})
		class HostBindingComponent {

			isBound = true;

			styleColor = color;

			className = className;

			attrValue = attrValue;

			propertyValue = propertyValue;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostBindingComponent
				]
			});
		});

		it ('should bind attribute to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostBindingComponent);

			// when
			fixture.detectChanges();

			// then
			assertHostBindings(fixture.nativeElement);
		});
	});

	describe('@HostBinding() -', () => {

		@Component({
			selector: '<host>',
			template: ``
		})
		class HostBindingComponent {

			@HostBinding('class')
			className = className;

			@HostBinding('class.bound')
			isBound = true;

			@HostBinding('style.color')
			styleColor = color;

			@HostBinding('attr.name')
			attrValue = attrValue;

			@HostBinding(propertyKey)
			property = propertyValue;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					HostBindingComponent
				]
			});
		});

		it ('should bind attribute to host element', () => {

			// given
			const fixture = TestBed.createComponent(HostBindingComponent);

			// when
			fixture.detectChanges();

			// then
			assertHostBindings(fixture.nativeElement);
		});

	});

});
