import {
	AfterViewInit, ChangeDetectorRef,
	Component, ContentChild, ContentChildren, Directive, forwardRef, Host, Inject, Injectable, InjectionToken, Injector, OnInit, QueryList, TemplateRef,
	ViewChild,
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

	add(field: FieldDirectiveRef) {
		this.fieldRefs.push(field);
	}
}

@Component({
	selector: 'root',
	template: `		
		
		<form-root>
			<ng-template>
				<p field >1</p>
			</ng-template>
			<ng-template>
				<p field >2</p>
			</ng-template>
			<ng-template>
				<p field >3</p>
			</ng-template>
		</form-root>
	
	`,
	providers: [{
		provide: FormFields,
		useClass: FormFields
	}]
})
export class RootComponent {

	constructor(public formFields: FormFields) {}
}

export class FieldDirectiveRef {}

const providers = [{
	provide: FieldDirectiveRef,
	useExisting: forwardRef(() => FieldDirective)
}];

@Component({
	selector: '[field]',
	template: ``,
	providers: providers
})
export class FieldDirective implements OnInit {

	constructor(private formFields: FormFields,
				private injector: Injector) {
	}

	ngOnInit() {
		this.formFields.add(this.injector.get(FieldDirectiveRef));
	}

}

describe('Dynamic forms -', () => {

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				RootComponent,
				FormRootComponent,
				FieldDirective
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
		expect(fixture.componentInstance.formFields.fieldRefs[0] instanceof FieldDirective).toBeTruthy();
		expect(fixture.componentInstance.formFields.fieldRefs[1] instanceof FieldDirective).toBeTruthy();
		expect(fixture.componentInstance.formFields.fieldRefs[2] instanceof FieldDirective).toBeTruthy();
	});

});

