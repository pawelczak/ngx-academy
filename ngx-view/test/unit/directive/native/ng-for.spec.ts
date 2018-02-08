import { Component, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';


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
			template: ``
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
					<simple *ngFor="let hero of heroes"></simple>
				`
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

			it('should render only new items added to array', () => {

				// given
				const fixture = TestBed.createComponent(TestComponent),
					compInstance = fixture.componentInstance,
					newHero = 'Voldemorth';

				fixture.detectChanges();

				expect(logger.logs.length).toBe(compInstance.heroes.length);

				// Creating new array with same the same objects
				fixture.componentInstance.heroes = [...fixture.componentInstance.heroes, newHero];
				fixture.detectChanges();

				// one additional render
				expect(logger.logs.length).toBe(compInstance.heroes.length);
			});

		});

	});

});
