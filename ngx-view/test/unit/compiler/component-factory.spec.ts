import { CommonModule } from '@angular/common';
import {
	ApplicationRef, Compiler, Component, ComponentFactory, Injectable, Injector, ModuleWithComponentFactories, NgModule, ViewChild,
	ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Compiler - component factory -', () => {

	@Component({
		template: `
			<div #container></div>
		`
	})
	class DynamicCompilerComponent {

		@ViewChild('container', {read: ViewContainerRef, static: true})
		container: ViewContainerRef;

		constructor(private compiler: Compiler) {
		}

		createComponent(clazz: any, meta: Component): void {

			const factory = this.createComponentFactorySync(this.compiler, meta, clazz);

			this.container.createComponent(factory);
		}

		private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
			const decoratedCmp = Component(metadata)(componentClass);

			@NgModule({imports: [CommonModule], declarations: [decoratedCmp]})
			class RuntimeComponentModule {
			}

			let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
			return module.componentFactories.find(f => f.componentType === decoratedCmp);
		}

	}

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [],
				declarations: [
					DynamicCompilerComponent
				]
			});
	});

	it('should create component factory', () => {

		// given
		const fixture = TestBed.createComponent(DynamicCompilerComponent);

		class RuntimeComponent {
		}

		const runtimeComponentMeta = {
			selector: 'runtime-component',
			template: `

				<div id="runtime-component" >Hello World</div>

			`
		};

		// when
		fixture.componentInstance.createComponent(RuntimeComponent, runtimeComponentMeta);
		fixture.detectChanges();

		// then
		const createdComponent = fixture.debugElement.query(By.css('runtime-component'));

		expect(createdComponent).not.toBeNull();
		expect(createdComponent.nativeElement.textContent.trim()).toBe('Hello World');
	});

});
