import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component - encapsulation -', () => {

	describe('None -', () => {

		@Component({
			selector: 'enc-none',
			template: `
				<div>Enc</div>
			`,
			styles: [``],
			encapsulation: ViewEncapsulation.None
		})
		class NoneEncapsulationComponent {}

		@Component({
			template: `
				<enc-none></enc-none>
			`
		})
		class TestComponent {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						NoneEncapsulationComponent,
						TestComponent
					]
				});
		});

		it ('should not generate fake encapsulation', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				el = fixture.nativeElement.querySelector('enc-none');

			// when
			fixture.detectChanges();

			// then
			const div = el.querySelector('div');

			expect(el.getAttribute('_nghost-c0')).toBeNull('Component tag');
			expect(div.getAttribute('_ngcontent-c0')).toBeNull('Node div inside component');
		});

	});

	/**
	 * Angular generates "markers" to mark host components and nodes inside it,
	 * which act as "emulated view encapsulation". Host component tag is marked
	 * with attribute _nghost-c${number}. Each node inside component is marked
	 * with attribute _ngcontent-c${number}. ${number} indicates the number of component
	 * in view tree.
	 */
	describe('Emulated -', () => {

		@Component({
			selector: 'enc-emulated',
			template: `
				<div>Enc</div>
			`,
			styles: [``],
			encapsulation: ViewEncapsulation.Emulated
		})
		class EncapsulationComponent {}

		@Component({
			selector: 'test',
			template: `
				<enc-emulated></enc-emulated>
			`,
			encapsulation: ViewEncapsulation.Emulated
		})
		class TestComponent {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						EncapsulationComponent,
						TestComponent
					]
				});
		});

		it ('should generate emulated encapsulation', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				el = fixture.nativeElement.querySelector('enc-emulated');

			// when
			fixture.detectChanges();

			// then
			const div = el.querySelector('div');

			expect(el.getAttribute('_nghost-c1')).toBe('', 'Component tag');
			expect(div.getAttribute('_ngcontent-c1')).toBe('', 'Node div inside component');
		});

	});

	xdescribe('Native -', () => {

		@Component({
			selector: 'enc-native',
			template: `
				<div>Enc</div>
			`,
			styles: [``],
			encapsulation: ViewEncapsulation.Native
		})
		class EncapsulationNativeComponent {}

		@Component({
			template: `
				<enc-native></enc-native>
			`,
		})
		class TestComponent {}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						EncapsulationNativeComponent,
						TestComponent
					]
				});
		});

		it ('should use shadow dom and should not generate any mock encapsulation', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				el = fixture.nativeElement.querySelector('enc');

			// when
			fixture.detectChanges();

			// then
			const div = el.querySelector('div');

			expect(el.getAttribute('_nghost-c0')).toBeNull('Component tag');
			expect(div.getAttribute('_ngcontent-c0')).toBeNull('Node div inside component');
		});

	});

});
