import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, NgModule } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';


describe('Dynamic component creation -', () => {

	describe('appRef -', () => {

		@Component({
			selector: 'simple',
			template: ``
		})
		class SimpleComponent {}

		@Injectable()
		class DynamicComponentService {

			constructor(private applicationRef: ApplicationRef,
						private componentFactoryResolver: ComponentFactoryResolver,
						@Inject(DOCUMENT) private document: any) {}

			create(): ComponentRef<any> {
				const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SimpleComponent);

				const injector: Injector = Injector.create([]);

				const componentRef = componentFactory.create(injector);

				// attach created component aka view to the view tree
				// this way change detection mechanism will work for created component
				this.applicationRef.attachView(componentRef.hostView);

				this.document.body.appendChild(componentRef.location.nativeElement);

				return componentRef;
			}
		}

		@NgModule({
			declarations: [
				SimpleComponent
			],
			entryComponents: [
				SimpleComponent
			]
		})
		class SimpleModule {}

		let dynamicComponentService: DynamicComponentService;

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						SimpleModule
					],
					providers: [
						DynamicComponentService
					],
					declarations: []
				});

			dynamicComponentService = TestBed.get(DynamicComponentService);
		});

		it ('should create component and attach it to the body', () => {

			// when
			dynamicComponentService.create();

			// then
			const comp = window.document.querySelectorAll('simple');
			expect(comp.length).toBe(1);
		});

	});

});
