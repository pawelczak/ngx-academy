import { Component, inject, Injectable, Injector, ɵsetCurrentInjector as setCurrentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * The inject() function allows to inject records from active
 * injection context.
 */
describe('Component - inject -', () => {

	/**
	 * Function inject() should be used inside factory function.
	 */
	describe('factory scope -' , () => {

		@Injectable({
			providedIn: 'root'
		})
		class VillainPower {}

		@Injectable({
			providedIn: 'root',
			useFactory: villainFactory
		})
		class Villain {
			power: VillainPower;
		}

		function villainFactory () {
			const villain = new Villain();
			villain.power = inject(VillainPower);
			return villain;
		}

		it('should be possible to use inject inside factory method', () => {

			let villain = TestBed.get(Villain);

			expect(villain instanceof Villain).toBeTruthy();
			expect(villain.power instanceof VillainPower).toBeTruthy();
		});
	});

	/**
	 * It's possible to set an injection context for inject function.
	 * The setCurrentInjector function is an internal angular function.
	 */
	describe('test scope -', () => {

		let injector: Injector;

		beforeEach(() => {
			injector = setCurrentInjector(null);
		});

		afterEach(() => {
			setCurrentInjector(injector);
		});

		@Injectable({
			providedIn: 'root'
		})
		class Prince {}

		it('should work in test scope', () => {
			let prince = inject(Prince);

			expect(prince instanceof Prince).toBeTruthy();
		})
	});

	describe('no context provided -', () => {

		class Hero {}

		@Component({
			template: ``
		})
		class InjectComponent {

			hero: Hero;

			constructor() {
				this.hero = inject(Hero);
			}
		}

		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				InjectComponent
			],
			providers: [
				Hero
			]
		});

		it('should be used inside injection context', () => {

			expect(() => TestBed.createComponent(InjectComponent)).toThrowError();
		});

	});

});
