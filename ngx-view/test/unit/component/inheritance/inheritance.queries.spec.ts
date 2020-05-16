import { Component, ContentChild, ContentChildren, ElementRef, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component Inheritance - Queries -', () => {

	describe('ViewChild -', () => {

		const givenValue = 'To the Bat-mobile !';

		class ViewChildComponent {
			@ViewChild('template', { static: true })
			template: ElementRef;
		}

		@Component({
			template: `
				<div #template>
					${givenValue}
				</div>
			`
		})
		class SubViewChildComponent extends ViewChildComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					SubViewChildComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(SubViewChildComponent);

			// when
			fixture.detectChanges();

			// then
			const template = fixture.componentInstance.template;

			expect(template).toBeDefined();
			expect(template.nativeElement.textContent.trim()).toEqual(givenValue);

		});
	});

	describe('ContentChild -', () => {

		class ContentChildComponent {
			@ContentChild('template', { static: true })
			template: TemplateRef<any>;
		}

		@Component({
			selector: 'sub-content-child',
			template: ``
		})
		class SubContentChildComponent extends ContentChildComponent {
		}

		@Component({
			template: `
				<sub-content-child>

					<ng-template #template>
						Because I'm Batman
					</ng-template>

				</sub-content-child>
			`
		})
		class TestComponent {
			@ViewChild(SubContentChildComponent, { static: true })
			contentChild: SubContentChildComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					TestComponent,
					SubContentChildComponent
				]
			});
		});

		it('should create container component', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.contentChild.template).toBeDefined();
		});
	});

	describe('query list -', () => {

		@Component({
			selector: 'simple',
			template: ``
		})
		class SimpleComponent {
		}

		describe('ViewChildren -', () => {

			class ViewChildrenComponent {
				@ViewChildren(SimpleComponent)
				comps: QueryList<SimpleComponent>;
			}

			@Component({
				template: `

					<simple></simple>

					<simple></simple>

					<simple></simple>
				`
			})
			class SubViewChildrenComponent extends ViewChildrenComponent {
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SubViewChildrenComponent,
						SimpleComponent
					]
				});
			});

			it('should create template component', () => {

				// given
				const fixture = TestBed.createComponent(SubViewChildrenComponent);

				// when
				fixture.detectChanges();

				// then
				const comps = fixture.componentInstance.comps.toArray();

				expect(comps.length).toEqual(3);
			});
		});

		describe('ContentChildren -', () => {

			class ContentChildrenComponent {
				@ContentChildren(SimpleComponent)
				comps: QueryList<SimpleComponent>;
			}

			@Component({
				selector: 'sub-children',
				template: `
				`
			})
			class SubContentChildrenComponent extends ContentChildrenComponent {
			}

			@Component({
				template: `
					<sub-children>
						<simple></simple>
	
						<simple></simple>
	
						<simple></simple>
					</sub-children>
				`
			})
			class TestComponent {
				@ViewChild(SubContentChildrenComponent, { static: true })
				subComp: SubContentChildrenComponent;
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					declarations: [
						SubContentChildrenComponent,
						TestComponent,
						SimpleComponent
					]
				});
			});

			it('should create template component', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent);

				// when
				fixture.detectChanges();

				// then
				const comps = fixture.componentInstance.subComp.comps.toArray();

				expect(comps.length).toEqual(3);
			});
		});

	});

});
