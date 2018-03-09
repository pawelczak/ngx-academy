import { Attribute, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * @Attribute allows to get a static value from a component or directive
 * You cannot dynamically change static attribute value on a component
 *
 * <simple-comp
 * 		id='#simple' <- cannot be changed by angular
 * 		>
 * </simple-comp>
 */
describe('@Attribute -', () => {

	/**
	 * Taken values are converted to strings
	 */
	describe('component -', () => {

		const givenId = 28,
			givenCssClass = 'nice-button',
			givenConfig = '{id: 8, name: \'test\'}';

		@Component({
			selector: 'attr-test',
			template: ``
		})
		class AttrComponent {

			constructor(@Attribute('id') public id: string,
						@Attribute('class') public cssClass: string,
						@Attribute('data-config') public config: string,
						@Attribute('empty') public empty: string) {}
		}

		@Component({
			selector: 'test',
			template: `
				<attr-test
					id="${givenId}"
					class="${givenCssClass}"
					data-config="${givenConfig}"
					empty >
				</attr-test>
			`
		})
		class TestComponent {
			@ViewChild(AttrComponent)
			attrRef: AttrComponent;
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					declarations: [
						TestComponent,
						AttrComponent
					]
				});
		});

		it ('should get attribute from a component', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance.attrRef;

			// when
			fixture.detectChanges();

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

	});

	/**
	 * @Attribute + [attr] directive
	 */

});
