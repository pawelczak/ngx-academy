import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import * as _ from 'lodash';


describe('Performance - ngFor -', () => {

	class Hero {
		constructor(public id: number,
					public name: string) {}
	}

	let givenHeroes = [
		new Hero(1, 'wolverine'),
		new Hero(2, 'magneto'),
		new Hero(3, 'deadpool')
	];

	describe('template -', () => {

		@Component({
			template: `
				<div *ngFor="let hero of heroes" >
					{{hero.name}}
				</div>
			`
		})
		class TestComponent {
			heroes = _.cloneDeep(givenHeroes);

			constructor(public changeDetectorRef: ChangeDetectorRef) {}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent
					]
				});
		});

		/**
		 * TestComponent displays in its template {{hero.name}}, so during change detection cycle
		 * angular checks if reference to hero.name has changed. When object mutates and changes
		 * its name property, angular will see it as change in template and it will render view.
		 */
		it('should re-render when object mutates', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance,
				newHeroName = 'Batman';

			// when
			fixture.detectChanges();

			compInstance.heroes[0].name = newHeroName;
			compInstance.heroes = [...compInstance.heroes];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('div'));

			// this should not re-render but actually it does
			expect(elements[0].nativeElement.textContent.trim()).toBe(newHeroName); // should change
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);
		});

		it('should re-render when object changes reference', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance,
				changedHero = new Hero(4, 'Batman');

			// when
			fixture.detectChanges();

			compInstance.heroes[0] = changedHero;
			compInstance.heroes = [...compInstance.heroes];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('div'));

			expect(elements[0].nativeElement.textContent.trim()).toBe(changedHero.name);
			expect(elements[0].nativeElement.textContent.trim()).not.toBe(givenHeroes[0].name);
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);
		});

	});

	describe('pure component -', () => {

		@Component({
			selector: 'hero',
			template: `{{hero.name}}`,
			changeDetection: ChangeDetectionStrategy.OnPush
		})
		class HeroComponent {
			@Input()
			hero: Hero;

			pure = true;

			static number = 0;

			constructor() {
				HeroComponent.number += 1;
			}
		}

		@Component({
			template: `
				<hero *ngFor="let hero of heroes"
					  [hero]="hero" >
				</hero>
			`
		})
		class PureNgForTestComponent {
			@ViewChildren(HeroComponent)
			heroCompRefs: QueryList<HeroComponent>;

			heroes = _.cloneDeep(givenHeroes);

			trackHeroBy(index: number, hero: Hero) {
				return hero.id;
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						PureNgForTestComponent,
						HeroComponent
					]
				});
		});

		it('should not re-render when object mutates', () => {

			// given
			const fixture = TestBed.createComponent(PureNgForTestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			compInstance.heroCompRefs.toArray().forEach((heroComp) => {
				heroComp.pure = false;
			});

			compInstance.heroes[0].name = 'Batman';
			compInstance.heroes = [...compInstance.heroes];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('hero'));

			expect(elements[0].nativeElement.textContent.trim()).not.toBe('Batman');
			expect(elements[0].nativeElement.textContent.trim()).toBe(givenHeroes[0].name);
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);

			compInstance.heroCompRefs.toArray().forEach((heroComp, index) => {
				expect(heroComp.pure).toBe(false);
			});
		});

		it('should render when object changes reference', () => {

			// given
			const fixture = TestBed.createComponent(PureNgForTestComponent),
				compInstance = fixture.componentInstance,
				newHero = new Hero(4, 'Batman');

			// when
			fixture.detectChanges();

			compInstance.heroCompRefs.toArray().forEach((heroComp) => {
				heroComp.pure = false;
			});

			compInstance.heroes[0] = newHero;
			compInstance.heroes = [...compInstance.heroes];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('hero'));

			expect(elements[0].nativeElement.textContent.trim()).toBe(newHero.name);
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);

			const heroRefs = compInstance.heroCompRefs.toArray();

			expect(heroRefs[0].pure).toBe(true, 'Component [0] has been recreated');
			expect(heroRefs[1].pure).toBe(false, 'Component [1] hasn\'t been recreated');
			expect(heroRefs[2].pure).toBe(false, 'Component [2] hasn\'t been recreated');
		});

		it('should re-render when reference changed', () => {

			// given
			const fixture = TestBed.createComponent(PureNgForTestComponent),
				compInstance = fixture.componentInstance,
				newHeroes = [
					new Hero(1, 'wolverine'),
					new Hero(2, 'magneto'),
					new Hero(3, 'deadpool')
				];

			// when
			fixture.detectChanges();

			compInstance.heroCompRefs.toArray().forEach((heroComp) => {
				heroComp.pure = false;
			});

			compInstance.heroes = newHeroes;

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('hero'));

			expect(elements[0].nativeElement.textContent.trim()).toBe(newHeroes[0].name);
			expect(elements[1].nativeElement.textContent.trim()).toBe(newHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(newHeroes[2].name);

			compInstance.heroCompRefs.toArray().forEach((heroComp) => {
				expect(heroComp.pure).toBe(true);
			});

		});

		/**
		 * TrackBy changes behavior of ngFor.
		 * Normally when reference changes to an object in an array,
		 * ngFor destroys component and recreates it. When you use
		 * trackBy, you can tell angular when to recreate component
		 * and when not to.
		 */
		describe('trackBy -', () => {

			const trackByTemplate = `
				<hero *ngFor="let hero of heroes;trackBy: trackHeroBy"
					  [hero]="hero" >
				</hero>
			`;

			/**
			 * In example below array of elements in changed, but new objects
			 * has same id as old ones. That makes angular not to recreate the components,
			 * but it changes input value of components, so new names will be rerendered properly.
			 */
			it('should not re-render when reference changed', () => {

				// given
				TestBed.overrideTemplate(PureNgForTestComponent, trackByTemplate);

				const fixture = TestBed.createComponent(PureNgForTestComponent),
					compInstance = fixture.componentInstance,
					newHeroes = [
						new Hero(1, 'Batman'),
						new Hero(2, 'Antman'),
						new Hero(3, 'Iceman')
					];

				// when
				fixture.detectChanges();

				compInstance.heroCompRefs.toArray().forEach((heroComp) => {
					heroComp.pure = false;
				});

				compInstance.heroes = newHeroes;

				fixture.detectChanges();

				// then
				const elements = fixture.debugElement.queryAll(By.css('hero'));

				expect(elements[0].nativeElement.textContent.trim()).toBe(newHeroes[0].name);
				expect(elements[1].nativeElement.textContent.trim()).toBe(newHeroes[1].name);
				expect(elements[2].nativeElement.textContent.trim()).toBe(newHeroes[2].name);

				compInstance.heroCompRefs.toArray().forEach((heroComp) => {
					expect(heroComp.pure).toBe(false);
				});

			});

		});

	});

});
