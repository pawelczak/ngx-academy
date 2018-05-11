import { inject, Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Tree shakeable - InjectionToken -', () => {

	const HERO_TOKEN = 'HERO_TOKEN',
		hero = 'Wolverine';

	/**
	 * Injection token provides value as string.
	 */
	describe('token with value -', () => {

		const injectionToken = new InjectionToken<string>(HERO_TOKEN, {
			providedIn: 'root',
			factory: () => hero
		});

		TestBed.configureTestingModule({});

		it('factory produces string value', () => {

			// when
			const actualHero = TestBed.get(injectionToken);

			// then
			expect(actualHero).toEqual(hero);
		});
	});

	/**
	 * InjectionToken can be assign with object of a class.
	 */
	describe('token with class -', () => {

		class Hero {}

		const injectionToken = new InjectionToken<Hero>(HERO_TOKEN, {
			providedIn: 'root',
			factory: () => new Hero()
		});

		TestBed.configureTestingModule({});

		it('factory produces object', () => {

			// when
			const actualHero = TestBed.get(injectionToken);

			// then
			expect(actualHero instanceof Hero).toBeTruthy();
		});
	});

	/**
	 * InjectionToken can be assign with object of a class, that has
	 * some dependencies. Factory can create a new object with dependency.
	 * In order to do that you need use inject function.
	 */
	describe('token with class with dependencies -', () => {

		@Injectable({
			providedIn: 'root'
		})
		class Power {}

		class Hero {
			constructor(public power: Power) {}
		}

		const injectionToken = new InjectionToken<Hero>(HERO_TOKEN, {
			providedIn: 'root',
			factory: () => new Hero(inject(Power))
		});

		TestBed.configureTestingModule({});

		it('factory produces object with dependencies', () => {

			// when
			const actualHero = TestBed.get(injectionToken);

			// then
			expect(actualHero instanceof Hero).toBeTruthy();
			expect(actualHero.power instanceof Power).toBeTruthy();
		});
	});

	/**
	 * Sometimes class has an abstract dependency like:
	 * class Hero {
	 * 		constructor(public power: Power <-- Abstract class) {}
	 * }
	 */
	describe('token with class with abstract dependencies -', () => {

		const heroPower = 'HeroPower';

		@Injectable({
			providedIn: 'root',
			useValue: heroPower
		})
		abstract class AbstractPower {}

		class Hero {
			constructor(public power: AbstractPower) {}
		}

		const injectionToken = new InjectionToken<Hero>(HERO_TOKEN, {
			providedIn: 'root',
			factory: () => new Hero(inject(AbstractPower as any)) // <- trick is to cast as any
		});

		TestBed.configureTestingModule({});

		it('factory produces object with abstract dependencies', () => {

			// when
			const actualHero = TestBed.get(injectionToken);

			// then
			expect(actualHero instanceof Hero).toBeTruthy();
			expect(actualHero.power).toEqual(heroPower);
		});
	});
});
