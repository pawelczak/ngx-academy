import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('useClass -', () => {

	describe('basic -', () => {

		const heroName = 'Just a hero',
			superHeroName = 'Super Hero';

		class SuperHero {
			name = superHeroName;
		}

		@Injectable({
			providedIn: 'root',
			useClass: SuperHero
		})
		class Hero {
			name = heroName;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({});
		});

		it('should provide useClass service', () => {

			// given
			const service = TestBed.get(Hero);

			// when & then
			expect(service instanceof SuperHero).toBeTruthy();
			expect(service.name).toEqual(superHeroName);
		});
	});

	/**
	 * With the provdedIn & useClass syntax you can easily provide token
	 * as abstract class.
	 */
	describe('abstract class as a token -', () => {

		class Wolverine implements AbstractHero {
			name = 'Logan';
		}

		@Injectable({
			providedIn: 'root',
			useClass: Wolverine
		})
		abstract class AbstractHero {
			abstract name: string;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({});
		});

		it('should provide useClass service', () => {

			// given
			const abstractHero = TestBed.get(AbstractHero);

			// when & then
			expect(abstractHero instanceof Wolverine).toBeTruthy();
			expect(abstractHero.name).toEqual('Logan');
		});

		it('should not be Wolverine class in the context', () => {

			// when & then
			expect(() => TestBed.get(Wolverine)).toThrowError();
		})

	});

});
