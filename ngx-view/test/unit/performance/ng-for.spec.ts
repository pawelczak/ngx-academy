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

			compInstance.heroes = [changedHero, givenHeroes[1], givenHeroes[2]];

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
				// console.log('HeroComp', HeroComponent.number);
			}
		}

		@Component({
			template: `
				<hero *ngFor="let hero of heroes"
					  [hero]="hero" >
				</hero>
			`
		})
		class TestComponent {
			@ViewChildren(HeroComponent)
			heroCompRefs: QueryList<HeroComponent>;

			heroes = _.cloneDeep(givenHeroes);
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent,
						HeroComponent
					]
				});
		});

		it('should not re-render when object mutates', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance;

			// when
			fixture.detectChanges();

			compInstance.heroes[0].name = 'Batman';
			compInstance.heroes = [...compInstance.heroes];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('hero'));

			expect(elements[0].nativeElement.textContent.trim()).toBe(givenHeroes[0].name); // should not change
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);
		});

		it('should render when object changes reference', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
				compInstance = fixture.componentInstance,
				newHero = new Hero(4, 'Batman');

			// when
			fixture.detectChanges();

			compInstance.heroCompRefs.toArray().forEach((heroComp) => {
				heroComp.pure = false;
			});

			compInstance.heroes = [newHero, givenHeroes[1], givenHeroes[2]];

			fixture.detectChanges();

			// then
			const elements = fixture.debugElement.queryAll(By.css('hero'));

			expect(elements[0].nativeElement.textContent.trim()).toBe(newHero.name);
			expect(elements[1].nativeElement.textContent.trim()).toBe(givenHeroes[1].name);
			expect(elements[2].nativeElement.textContent.trim()).toBe(givenHeroes[2].name);

			compInstance.heroCompRefs.toArray().forEach((heroComp, index) => {
				expect(heroComp.pure).toBe(true);
			});
		});

		it('should re-render when reference changed', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent),
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

	});

});
