import { Component, Directive, forwardRef, Host, Injector, Self, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


describe('Directive - reference -', () => {

	describe('exportAs -', () => {

		@Directive({
			selector: '[export-dir]',
			exportAs: 'exportRef'
		})
		class ExportDirective {}

		@Component({
			selector: 'test',
			template: `<span export-dir #dirRef="exportRef"></span>`
		})
		class TestComponent {
			@ViewChild(ExportDirective)
			dirRef: ExportDirective;
		}

		it ('should be possible to reference to directive from a node using viewChild', () => {

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						ExportDirective
					]
				});

			const fixture = TestBed.createComponent(TestComponent),
				debug = fixture.debugElement;

			// when
			fixture.detectChanges();

			// then
			expect(fixture.componentInstance.dirRef).toBeDefined();
			expect(fixture.componentInstance.dirRef instanceof ExportDirective).toBe(true);

			const debugElements = debug.queryAll(By.directive(ExportDirective));
			expect(debugElements).toBeDefined();
			expect(debugElements[0].injector.get(ExportDirective)).toBe(fixture.componentInstance.dirRef);
		});

	});

	describe('injector -', () => {

		@Directive({
			selector: '[simple-dir]'
		})
		class SimpleDirective {}

		it ('should NOT be possible to inject directive to component, without adding it to providers', () => {

			@Component({
				selector: 'test',
				template: `<span simple-dir ></span>`
			})
			class TestComponent {
				constructor(public simpleDirective: SimpleDirective) {}
			}

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						SimpleDirective
					]
				});

			// when & then
			expect(() => TestBed.createComponent(TestComponent)).toThrowError();
		});

		it ('should NOT be possible to get directive from child injector', () => {

			@Component({
				selector: 'test',
				template: `
					<span simple-dir ></span>
					<test-child></test-child>
				`
			})
			class TestComponent {
				@ViewChild(forwardRef(() => TestChildComponent))
				testChild: TestChildComponent;

				constructor(public injector: Injector) {}
			}

			@Component({
				selector: 'test-child',
				template: `<span simple-dir ></span>`
			})
			class TestChildComponent {
				constructor(public injector: Injector) {}
			}

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						TestChildComponent,
						SimpleDirective
					]
				});
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			expect(() => fixture.componentInstance.injector.get(SimpleDirective)).toThrowError();
			expect(() => fixture.componentInstance.testChild.injector.get(SimpleDirective)).toThrowError();
		});

	});

	describe('shared injector -', () => {

		const DIDIRECTIVE_VALUE = 'DIDirective';

		class DIDirectiveRef {}

		@Directive({
			selector: '[di-dir]'
		})
		class DIDirective {
			value = DIDIRECTIVE_VALUE;
		}

		@Component({
			selector: 'shared-node',
			template: `<shared-node-child></shared-node-child>`
		})
		class SharedNodeComponent {
			@ViewChild(forwardRef(() => SharedNodeChildComponent))
			sharedChild: SharedNodeChildComponent;

			constructor(@Host() public diDirective: DIDirective) {}
		}

		@Component({
			selector: 'test',
			template: `<shared-node di-dir #compRef ></shared-node>`
		})
		class TestComponent {
			@ViewChild('compRef')
			compRef: SharedNodeComponent;
		}

		@Component({
			selector: 'shared-node-child',
			template: ``
		})
		class SharedNodeChildComponent {
			constructor(public diDirective: DIDirective) {}
		}

		it ('should be possible to get reference to a directive using dependency injection', () => {

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						SharedNodeComponent,
						SharedNodeChildComponent,
						DIDirective
					]
				});

			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const sharedNodeComp = fixture.componentInstance.compRef;
			expect(sharedNodeComp.diDirective).toBeDefined();
			expect(sharedNodeComp.diDirective instanceof DIDirective).toBe(true);
			expect((sharedNodeComp.diDirective as DIDirective).value).toBe(DIDIRECTIVE_VALUE);
		});

		it ('child should have access to directive on shared-component', () => {

			// given
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						TestComponent,
						SharedNodeComponent,
						SharedNodeChildComponent,
						DIDirective
					]
				});

			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();

			// then
			const sharedNodeComp = fixture.componentInstance.compRef;
			expect(sharedNodeComp.sharedChild.diDirective).toBeDefined();
			expect(sharedNodeComp.sharedChild.diDirective instanceof DIDirective).toBe(true);
			expect((sharedNodeComp.sharedChild.diDirective as DIDirective).value).toBe(DIDIRECTIVE_VALUE);
		});

	});

});
