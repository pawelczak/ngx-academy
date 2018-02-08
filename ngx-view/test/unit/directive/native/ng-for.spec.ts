import { componentFactoryName } from '@angular/compiler';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ComponentFixture } from '@angular/core/testing/src/component_fixture';
import { By } from '@angular/platform-browser';


describe('NgFor -', () => {

	describe('useage -', () => {

		@Component({
			selector: 'ngfor-test',
			template: ``
		})
		class NgForTestComponent {

			heroes = ['spiderman', 'wolverine', 'xavier'];
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						NgForTestComponent
					]
				})
		});

		describe('structural -', () => {

			it ('should render basic list', () => {

				// given
				const templ = `<p *ngFor="let hero of heroes">
									{{hero}}
								</p>`;

				TestBed.overrideTemplate(NgForTestComponent, templ);
				const fixture = TestBed.createComponent(NgForTestComponent),
					componentInst = fixture.componentInstance,
					nativeEl = fixture.debugElement.nativeElement;

				// when
				fixture.detectChanges();

				// then
				const tags = nativeEl.querySelectorAll('p');
				expect(tags.length).toBe(componentInst.heroes.length);
				tags.forEach((tag: any, index: number) => {
					expect(tag.textContent.trim()).toEqual(componentInst.heroes[index]);
				});

			});

		});

		describe('template -', () => {

			it ('should render basic list', () => {

				// given
				const templ = `<ng-template ngFor [ngForOf]="heroes" let-hero >
									<p>{{hero}}</p>
								</ng-template>`;

				TestBed.overrideTemplate(NgForTestComponent, templ);
				const fixture = TestBed.createComponent(NgForTestComponent),
					componentInst = fixture.componentInstance,
					nativeEl = fixture.debugElement.nativeElement;

				// when
				fixture.detectChanges();

				// then
				const tags = nativeEl.querySelectorAll('p');
				expect(tags.length).toBe(componentInst.heroes.length);
				tags.forEach((tag: any, index: number) => {
					expect(tag.textContent.trim()).toEqual(componentInst.heroes[index]);
				});

			});

		});

	});

	/**
	 * Changing trackBy makes only sense to use it with ChangeDetectionStrategy.OnPush
	 */
	describe('trackBy -', () => {

		let logger: Logger;

		@Injectable()
		class Logger {
			logs: Array<string> = [];
			log(text: string): void {
				this.logs.push(text);
			}
			reset(): void {
				this.logs = [];
			}
		}

		@Component({
			selector: 'simple',
			template: `<ng-content></ng-content>`,
			changeDetection: ChangeDetectionStrategy.OnPush
		})
		class SimpleComponent {
			constructor(private logger: Logger) {}

			ngAfterViewInit() {
				this.logger.log('Simple component render');
			}
		}

		describe('string -', () => {

			@Component({
				selector: 'test',
				template: `
					<simple *ngFor="let hero of heroes">
						{{hero}}
					</simple>
				`,
				changeDetection: ChangeDetectionStrategy.OnPush
			})
			class TestComponent {

				heroOne = 'spiderman';
				heroTwo = 'wolverine';
				heroThree = 'xavier';

				heroes = [this.heroOne, this.heroTwo, this.heroThree];
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							CommonModule
						],
						declarations: [
							SimpleComponent,
							TestComponent
						],
						providers: [
							Logger
						]
					});

				logger = TestBed.get(Logger);
			});

			/**
			 * N
			 */
			it('should not re-render elements which reference hasn\'t changed', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				fixture.detectChanges();

				expect(logger.logs.length).toBe(compInstance.heroes.length);

				// Creating new array with same the same objects
				fixture.componentInstance.heroes = [...fixture.componentInstance.heroes];
				fixture.detectChanges();

				// no additional renders
				expect(logger.logs.length).toBe(compInstance.heroes.length);
			});

			xit('should render only new items added to array', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance,
					newHero = 'Gandalf';

				fixture.detectChanges();

				expect(logger.logs.length).toBe(compInstance.heroes.length);

				// Creating new array with same the same objects
				fixture.componentInstance.heroes = [...fixture.componentInstance.heroes, newHero];
				fixture.detectChanges();

				// one additional render
				expect(logger.logs.length).toBe(compInstance.heroes.length);
			});

		});

		describe('object -', () => {

			class Hero {
				constructor(public id: number,
							public name: string) {}

				clone(): Hero {
					return new Hero(this.id, this.name);
				}
			}

			@Component({
				selector: 'hero',
				template: `{{hero.name}}`,
				changeDetection: ChangeDetectionStrategy.OnPush
			})
			class HeroComponent {
				@Input()
				hero: Hero;

				constructor(private logger: Logger) {}

				ngAfterViewInit() {
					this.logger.log('Hero component render');
				}
			}

			@Component({
				selector: 'test',
				template: `
					<hero *ngFor="let hero of heroes" [hero]="hero">
					</hero>
				`,
				changeDetection: ChangeDetectionStrategy.OnPush
			})
			class TestComponent {

				heroOne = new Hero(1, 'spiderman');
				heroTwo = new Hero(2,'wolverine');
				heroThree = new Hero(3,'xavier');

				heroes = [this.heroOne, this.heroTwo, this.heroThree];

				constructor(private changeDetectorRef: ChangeDetectorRef) {}

				uniqueHero(index: number, hero: Hero) {
					return hero.id;
				}

				rebuild() {
					this.changeDetectorRef.detectChanges();
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							CommonModule
						],
						declarations: [
							HeroComponent,
							TestComponent
						],
						providers: [
							Logger
						]
					});
			});

			/**
			 * Reference to objects inside array hasn't changed
			 */
			it('should render elements only one', () => {

				// given
				logger = TestBed.get(Logger);
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				fixture.detectChanges();

				expect(logger.logs.length).toBe(compInstance.heroes.length);

				// Creating new array with same the same objects
				fixture.componentInstance.heroes = [...fixture.componentInstance.heroes];
				compInstance.rebuild();
				fixture.detectChanges();

				// no additional renders
				expect(logger.logs.length).toBe(compInstance.heroes.length);
				assertHeroes(fixture);
			});

			/**
			 * Object Mutation
			 */
			it('should not re-render elements when they mutate', () => {

				// given
				logger = TestBed.get(Logger);
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				fixture.detectChanges();

				// when
				// Hero mutation
				compInstance.heroOne.id = 8;
				compInstance.heroOne.name = 'Batman';
				fixture.componentInstance.heroes = [...fixture.componentInstance.heroes];
				compInstance.rebuild();

				fixture.detectChanges();

				// then
				const elements = fixture.debugElement.queryAll(By.css('hero'));

				expect(elements[0].nativeElement.textContent.trim()).not.toBe(compInstance.heroOne.name);
				expect(elements[0].nativeElement.textContent.trim()).toBe('spiderman');
				expect(logger.logs.length).toBe(compInstance.heroes.length);
			});

			/**
			 * Changing reference to objects should make them be re-rendered.
			 * In this case re-renders are not required, because objects are cloned,
			 * so they are replaced with the exact copy of itself.
			 */
			it('should not re-render elements when they mutate', () => {

				// given
				logger = TestBed.get(Logger);
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				fixture.detectChanges();

				// when
				// Hero mutation
				fixture.componentInstance.heroes = [
					compInstance.heroOne.clone(),
					compInstance.heroTwo.clone(),
					compInstance.heroThree.clone()
				];
				compInstance.rebuild();

				fixture.detectChanges();


				// then
				assertHeroes(fixture);
				// every element is re-rendered
				expect(logger.logs.length).toBe(compInstance.heroes.length + 3);
			});

			/**
			 * Object Mutation + trackBy
			 *
			 */
			it('should render elements when they mutate', () => {

				// given
				TestBed.overrideTemplate(TestComponent, `
					<hero *ngFor="let hero of heroes; trackBy: uniqueHero" [hero]="hero" >
					</hero>
				`);
				logger = TestBed.get(Logger);

				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance;

				fixture.detectChanges();

				// when
				// Hero mutation
				fixture.componentInstance.heroes = [
					compInstance.heroOne.clone(),
					compInstance.heroTwo.clone(),
					compInstance.heroThree.clone()
				];
				compInstance.rebuild();
				fixture.detectChanges();

				// then
				expect(logger.logs.length).toBe(compInstance.heroes.length);
				assertHeroes(fixture);
			});

			function assertHeroes(fixture: ComponentFixture<TestComponent>) {
				const compInstance = fixture.componentInstance,
					elements = fixture.debugElement.queryAll(By.css('hero'));

				expect(elements[0].nativeElement.textContent.trim()).toBe(compInstance.heroOne.name);
				expect(elements[1].nativeElement.textContent.trim()).toBe(compInstance.heroTwo.name);
				expect(elements[2].nativeElement.textContent.trim()).toBe(compInstance.heroThree.name);
			}

		});

	});

});
