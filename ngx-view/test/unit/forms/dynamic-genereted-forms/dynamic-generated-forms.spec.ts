import {
	Component, ContentChildren, forwardRef, Injectable, Injector, Input, OnInit, QueryList, TemplateRef,
	ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';


@Component({
	selector: 'form-root',
	template: ``
})
export class FormRootComponent {

	@ContentChildren(TemplateRef)
	templates: QueryList<TemplateRef<any>>;

	constructor(private viewContainerRef: ViewContainerRef) {}

	ngAfterContentInit() {
		this.templates
			.toArray()
			.forEach((template) => {
				let viewRef = this.viewContainerRef.createEmbeddedView(template);
				viewRef.detectChanges();
			});
	}
}

@Injectable()
export class FormFields {
	fieldRefs: any = [];

	add(field: FieldComponentRef) {
		this.fieldRefs.push(field);
	}
}

export class FieldComponentRef {}

const providers = [{
	provide: FieldComponentRef,
	useExisting: forwardRef(() => FieldComponent)
}];

@Component({
	selector: '[field]',
	template: ``,
	providers: providers
})
export class FieldComponent implements OnInit {

	@Input('fieldValue')
	value: string;

	constructor(private formFields: FormFields,
				private injector: Injector) {
	}

	ngOnInit() {
		this.formFields.add(this.injector.get(FieldComponentRef));
	}

}

describe('Dynamic forms -', () => {


	const fieldValueOne = 1,
		fieldValueTwo = 2,
		fieldValueThree = 3;

	@Component({
		selector: 'root',
		template: `

			<form-root>
				<ng-template>
					<p field [fieldValue]="fieldValueOne" ></p>
				</ng-template>
				<ng-template>
					<p field [fieldValue]="fieldValueTwo" ></p>
				</ng-template>
				<ng-template>
					<p field [fieldValue]="fieldValueThree" ></p>
				</ng-template>
			</form-root>

		`,
		providers: [{
			provide: FormFields,
			useClass: FormFields
		}]
	})
	class RootComponent {
		constructor(public formFields: FormFields) {}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				RootComponent,
				FormRootComponent,
				FieldComponent
			]
		});
	});

	it ('should work', () => {

		// given
		const fixture = TestBed.createComponent(RootComponent);

		// when
		fixture.detectChanges();

		// then
		expect(fixture.componentInstance.formFields.fieldRefs.length).toBe(3);
		expect(fixture.componentInstance.formFields.fieldRefs[0] instanceof FieldComponent).toBeTruthy();
		// expect(fixture.componentInstance.formFields.fieldRefs[0].value).toBe(fieldValueOne);
		expect(fixture.componentInstance.formFields.fieldRefs[1] instanceof FieldComponent).toBeTruthy();
		// expect(fixture.componentInstance.formFields.fieldRefs[1].value).toBe(fieldValueTwo);
		expect(fixture.componentInstance.formFields.fieldRefs[2] instanceof FieldComponent).toBeTruthy();
		// expect(fixture.componentInstance.formFields.fieldRefs[2].value).toBe(fieldValueThree);
	});

});

