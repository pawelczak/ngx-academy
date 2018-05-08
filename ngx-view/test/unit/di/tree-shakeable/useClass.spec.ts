import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('useClass -', () => {

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
