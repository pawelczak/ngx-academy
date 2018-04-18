import { Component, Injectable, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
			
				<div *ngIf="listReady" class="loader">
					Loading...
				</div>
				
				<div *ngFor="let hero of heroes">
					{{hero}}
				</div>
			
			`
		})
		class HeroesComponent implements OnInit {

			heroes: Array<string>;
			listReady: boolean = false;

			constructor(private heroesService: HeroesService) {}

			ngOnInit() {
				this.heroesService
					.getHeroes()
					.subscribe((heroes: Array<string>) => {
						this.heroes = heroes;
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
					return
				}
			}

		});

	});


});