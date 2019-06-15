import { Component, ContentChild, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Inheritance Queries -', () => {

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
		class TestComponent extends ViewChildComponent {
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					TestComponent
				]
			});
		});

		it('should create template component', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

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
			selector: 'content-child-inherited',
			template: ``
		})
		class TestContentChildComponent extends ContentChildComponent {
		}

		@Component({
			template: `
				<content-child-inherited>
					
					<ng-template #template>
						Because I'm Batman
					</ng-template>
					
				</content-child-inherited>
			`
		})
		class TestComponent {
			@ViewChild(TestContentChildComponent)
			contentChild: TestContentChildComponent;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					TestComponent,
					TestContentChildComponent
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
