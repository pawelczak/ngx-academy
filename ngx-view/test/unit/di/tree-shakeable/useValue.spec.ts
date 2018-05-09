import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('useValue -', () => {

	describe('basic -', () => {

		const heroName = 'Just a hero';

		@Injectable({
			providedIn: 'root',
			useValue: heroName
		})
		class HeroName {}

		beforeEach(() => {
			TestBed.configureTestingModule({});
		});

		it('should provide useValue service', () => {

			// given
			const actualHeroName = TestBed.get(HeroName);

			// when & then
			expect(actualHeroName).toEqual(heroName);
		});
	});
});
