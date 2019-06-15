import { Component, ContentChild, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component Inheritance - Queries -', () => {

	describe('ViewChild -', () => {

		const givenValue = 'To the Bat-mobile !';

		class ViewChildComponent {
			@ViewChild('template')
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
			@ContentChild('template')
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
			@ViewChild(SubContentChildComponent)
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


});
