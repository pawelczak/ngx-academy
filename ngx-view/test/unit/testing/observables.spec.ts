import { Component, Injectable, OnInit } from '@angular/core';
import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { async as asyncScheduler } from 'rxjs/scheduler/async';
import { cold, getTestScheduler } from 'jasmine-marbles';

/**
 * Patterns for testing observable data
 */
describe('Observables testing -', () => {

	describe('Component data -', () => {

		const heroes = [
			'Magneto',
			'Wolverine',
			'Hugh Jackman'
		];

		abstract class HeroesService {
			abstract getHeroes(): Observable<Array<string>>;
		}

		@Component({
			template: `
			
				<div *ngIf="showLoader" class="loader">
					Loading...
				</div>
				
				<div *ngFor="let hero of heroes">
					{{hero}}
				</div>
			
			`
		})
		class HeroesComponent implements OnInit {

			heroes: Array<string>;
			showLoader: boolean = true;

			constructor(private heroesService: HeroesService) {}

			ngOnInit() {
				this.heroesService
					.getHeroes()
					.subscribe((heroes: Array<string>) => {
						this.heroes = heroes;
						this.showLoader = false;
					});
			}
		}

		/**
		 * When you try to test component that uses observables,
		 * you shouldn't use observable creator 'of'. In normal
		 * situation observables are async by design and in testing
		 * 'of' acts as synchronous.
		 */
		describe('anti-pattern -', () => {

			class CommonHeroesService extends HeroesService {
				getHeroes(): Observable<Array<string>> {
					return of(heroes);
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HeroesComponent
						],
						providers: [{
							provide: HeroesService,
							useClass: CommonHeroesService
						}]
					});
			});

			/**
			 * It's impossible to test loader, when you use 'of' creator.
			 * Of acts synchronously, so it gives you data right away.
			 */
			it ('should not show loader', () => {

				// given
				const fixture = TestBed.createComponent(HeroesComponent),
					debugElement = fixture.debugElement;

				// when
				fixture.detectChanges();

				// then
				const loaderElement = debugElement.query(By.css('.loader'));

				expect(loaderElement).toBeFalsy();
			});

		});

		describe('schedulers -', () => {

			class SchedulerHeroesService extends HeroesService {
				getHeroes(): Observable<Array<string>> {
					return of(heroes, asyncScheduler);
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HeroesComponent
						],
						providers: [{
							provide: HeroesService,
							useClass: SchedulerHeroesService
						}]
					});
			});

			/**
			 * Async scheduler will not serve data right away.
			 * In order to get it you need to trigger tick function.
			 */
			it ('should not show loader', fakeAsync(() => {

				// given
				const fixture = TestBed.createComponent(HeroesComponent),
					debugElement = fixture.debugElement;

				// when before async data appears
				fixture.detectChanges();

				// then
				let loaderElement = debugElement.query(By.css('.loader'));
				expect(loaderElement).toBeTruthy();

				// when async data appears
				tick();
				fixture.detectChanges();

				// then
				loaderElement = debugElement.query(By.css('.loader'));
				expect(loaderElement).toBeFalsy();
			}));

		});

		/**
		 * Defer creates observable when someone tries to subscribe to it.
		 */
		describe('defer -', () => {

			class DeferHeroesService extends HeroesService {
				getHeroes(): Observable<Array<string>> {
					return defer(() => Promise.resolve(heroes));
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HeroesComponent
						],
						providers: [{
							provide: HeroesService,
							useClass: DeferHeroesService
						}]
					});
			});

			/**
			 * It's possible to delay data with the Observable creator defer,
			 * that wraps promise.
			 */
			it ('should not show loader', fakeAsync(() => {

				// given
				const fixture = TestBed.createComponent(HeroesComponent),
					debugElement = fixture.debugElement;

				// when before async data appears
				fixture.detectChanges();

				// then loader should be present
				let loaderElement = debugElement.query(By.css('.loader'));
				expect(loaderElement).toBeTruthy();

				// when data appears
				flushMicrotasks();
				fixture.detectChanges();

				// then loader should be hidden
				loaderElement = debugElement.query(By.css('.loader'));

				expect(loaderElement).toBeFalsy();
			}));

		});

		describe('jasmine-marbles -', () => {

			class MarbleHeroesService extends HeroesService {
				getHeroes(): Observable<Array<string>> {
					return cold('---h|', {h: heroes});
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [],
						declarations: [
							HeroesComponent
						],
						providers: [{
							provide: HeroesService,
							useClass: MarbleHeroesService
						}]
					});
			});

			/**
			 * It's possible to delay data with the Observable creator defer,
			 * that wraps promise.
			 */
			it ('should not show loader', () => {

				// given
				const fixture = TestBed.createComponent(HeroesComponent),
					debugElement = fixture.debugElement;

				// when before async data appears
				fixture.detectChanges();

				// then loader should be present
				let loaderElement = debugElement.query(By.css('.loader'));
				expect(loaderElement).toBeTruthy();

				// when
				getTestScheduler().flush();
				fixture.detectChanges();

				// then
				loaderElement = debugElement.query(By.css('.loader'));

				expect(loaderElement).toBeFalsy();
			});

		});

	});

});
