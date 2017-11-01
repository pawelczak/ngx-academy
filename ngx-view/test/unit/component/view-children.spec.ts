import {
	Component, ElementRef, QueryList, TemplateRef, ViewChildren, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BlankComponent } from './helpers/blank.component';
import { isViewContainerRef } from './helpers/matchers';
import { NgTemplateOutlet } from '@angular/common';

describe('ViewChildren -', () => {

	describe('template references -', () => {

		@Component({
			selector: 'view-children-component',
			template: `

				<p class="paragraph" >Lorem</p>
				<p class="paragraph" >ipsum</p>
				<p class="paragraph" >dolor</p>
				
				<blank></blank>
				<blank></blank>
				<blank></blank>
				
				<ng-template></ng-template>
				<ng-template></ng-template>
				<ng-template></ng-template>
				
			`
		})
		class ViewChildrenComponent {

			@ViewChildren(BlankComponent)
			blankComponents: QueryList<BlankComponent>;

			@ViewChildren(BlankComponent, { read: ElementRef })
			blankComponentsAsElemRef: QueryList<ElementRef>;

			@ViewChildren(BlankComponent, { read: TemplateRef })
			blankComponentsAsTempRef: QueryList<TemplateRef<any>>;

			@ViewChildren(BlankComponent, { read: ViewContainerRef })
			blankComponentsAsVcr: QueryList<ViewContainerRef>;

			@ViewChildren(TemplateRef)
			tempRefs: QueryList<TemplateRef<any>>;

			@ViewChildren('p')
			pElements: QueryList<ElementRef>;

		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						ViewChildrenComponent,
						BlankComponent
					]
				});
		});

		it ('should be possible to get reference to ng-template', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.tempRefs.length).toEqual(3);
			expect(fixture.componentInstance.tempRefs.first instanceof TemplateRef).toBe(true, 'TemplateRef as TemplateRef'); // TRUE
		});

		it ('should be possible to get reference to components', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.blankComponents.length).toEqual(3);
			expect(fixture.componentInstance.blankComponents.first instanceof BlankComponent).toBe(true, 'componentRef as ComponentRef'); // TRUE

			expect(fixture.componentInstance.blankComponentsAsElemRef.length).toEqual(3);
			expect(fixture.componentInstance.blankComponentsAsElemRef.first instanceof ElementRef).toBe(true, 'componentRef as ElementRef'); // TRUE

			expect(fixture.componentInstance.blankComponentsAsTempRef.length).toEqual(3);
			expect(fixture.componentInstance.blankComponentsAsTempRef.first instanceof TemplateRef).toBe(false, 'componentRef as TemplateRef'); // TRUE

			expect(fixture.componentInstance.blankComponentsAsVcr.length).toEqual(3);
			expect(isViewContainerRef(fixture.componentInstance.blankComponentsAsVcr.first)).toBe(true, 'componentRef as ViewContainerRef'); // TRUE
		});

		it ('not possible to get multiple element references by HTML tag selector', () => {

			// given
			const fixture = TestBed.createComponent(ViewChildrenComponent);

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.pElements.length).toEqual(0);
		});

	});

});
