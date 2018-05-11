import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Tree shakeable - InjectionToken -', () => {


	const HERO_TOKEN = 'HERO_TOKEN',
		hero = 'Wolverine';

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
});
