import { Component, ContentChild, ContentChildren, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('Component queries -', () => {

	@Component({
		selector: 'simple',
		template: ``
	})
	class SimpleComponent {}

	@Component({
		selector: 'queries',
		template: `
			<simple></simple>
		`,
		queries: {
			contentChild: new ContentChild(SimpleComponent),
			contentChildren: new ContentChildren(SimpleComponent),
			viewChild: new ViewChild(SimpleComponent),
			viewChildren: new ViewChildren(SimpleComponent)
		}
	})
	class QueriesComponent {

		contentChild: SimpleComponent;
		contentChildren: QueryList<SimpleComponent>;
		viewChild: SimpleComponent;
		viewChildren: QueryList<SimpleComponent>;
	}

	@Component({
		selector: 'test',
		template: `
			<queries>
				<simple></simple>
			</queries>
		`
	})
	class TestComponent {
		@ViewChild(QueriesComponent)
		queriesRef: QueriesComponent;
	}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				declarations: [
					SimpleComponent,
					QueriesComponent,
					TestComponent
				]
			});
	});

	it ('should get references to components', () => {

		// given
		const fixture = TestBed.createComponent(TestComponent),
			queriesComp = fixture.componentInstance.queriesRef;

		// when
		fixture.detectChanges();

		// then
		expect(queriesComp.contentChild).toBeDefined('ContentChild');
		expect(queriesComp.contentChild instanceof SimpleComponent).toBeTruthy('ContentChild');

		expect(queriesComp.contentChildren).toBeDefined('ContentChildren');
		expect(queriesComp.contentChildren.toArray()[0] instanceof SimpleComponent).toBeTruthy('ContentChildren');

		expect(queriesComp.viewChild).toBeDefined('ViewChild');
		expect(queriesComp.viewChild instanceof SimpleComponent).toBeTruthy('ViewChild');

		expect(queriesComp.viewChildren).toBeDefined('ViewChildren');
		expect(queriesComp.viewChildren.toArray()[0] instanceof SimpleComponent).toBeTruthy('ViewChildren');
	});

});
