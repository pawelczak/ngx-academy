import { Attribute, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * @Attribute allows to get a static value from a component or directive
 * You cannot dynamically change static attribute value on a component
 *
 * <simple-comp
 *        id='#simple' <- cannot be changed by angular
 *        >
 * </simple-comp>
 */
describe('@Attribute -', () => {

	/**
	 * Taken values are converted to strings
	 */
	describe('component -', () => {

		const givenId = 28,
			givenCssClass = 'nice-button',
			givenConfig = '{id: 8, name: \'test\'}',
			givenValue = 'Awesome value';

		@Component({
			selector: 'attr-test',
			template: ``
		})
		class AttrComponent {

			constructor(@Attribute('id') public id: string,
						@Attribute('class') public cssClass: string,
						@Attribute('data-config') public config: string,
						@Attribute('empty') public empty: string,
						@Attribute('not-provided') public notProvided: string,
						@Attribute('not-provided') public notProvidedWithDefault: string = givenValue) {
			}
		}

		@Component({
			selector: 'test',
			template: `
				<attr-test
						id="${givenId}"
						class="${givenCssClass}"
						data-config="${givenConfig}"
						empty>
				</attr-test>
			`
		})
		class TestComponent {
			@ViewChild(AttrComponent, { static: true })
			attrRef: AttrComponent;
		}

		let compInstance: any;

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent,
						AttrComponent
					]
				});

			// given
			const fixture = TestBed.createComponent(TestComponent);
			compInstance = fixture.componentInstance.attrRef;

			// when
			fixture.detectChanges();
		});

		it('should get attribute from a component', () => {

			// then
			expect(compInstance.id).toEqual('' + givenId);
			expect(typeof compInstance.id).toEqual('string');

			expect(compInstance.cssClass).toEqual(givenCssClass);
			expect(typeof compInstance.cssClass).toEqual('string');

			expect(compInstance.config).toEqual(givenConfig);
			expect(typeof compInstance.config).toEqual('string');

			expect(compInstance.empty).toEqual('');
			expect(typeof compInstance.empty).toEqual('string');
		});

		/**
		 * Attribute doesn't exist on components tag.
		 */
		it('should not provided inputs set to null', () => {

			expect(compInstance.notProvided).toBeNull();
		});

		/**
		 * Attribute doesn't exist on components tag, but default value is null.
		 */
		it('shouldn\'t set value on inputs that doesn\'t exist', () => {

			expect(compInstance.notProvidedWithDefault).not.toBe(givenValue);
			expect(compInstance.notProvidedWithDefault).toBeNull();
		});

	});

	/**
	 * @Attribute + [attr] directive
	 */

});
