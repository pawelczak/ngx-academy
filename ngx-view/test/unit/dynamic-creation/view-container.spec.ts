import {
	AfterViewInit,
	Component, ComponentFactoryResolver, NgModule, ViewChild,
	ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Dynamic component - ViewContainerRef -', () => {

	describe('createComponent -', () => {

		@Component({
			selector: 'simple',
			template: ``
		})
		class SimpleComponent {}

		@Component({
			selector: 'creator',
			template: `
				<div #container>
				</div>
			`
		})
		class CreatorComponent implements AfterViewInit {
			@ViewChild('container', { read: ViewContainerRef})
			container: ViewContainerRef;

			constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

			ngAfterViewInit() {
				const factory = this.componentFactoryResolver.resolveComponentFactory(SimpleComponent);
				this.container.createComponent(factory);
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

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						SimpleModule
					],
					declarations: [
						CreatorComponent
					]
				});
		});

		it ('should create simple component and attach it to the body', () => {

			// given
			const fixture = TestBed.createComponent(CreatorComponent);

			// when
			fixture.detectChanges();

			// then
			const comp = fixture.debugElement.query(By.css('simple'));
			expect(comp).toBeDefined();
		});

	});

});
