describe('Builder', () => {

	abstract class ImmutableBuilder<T> {

		protected abstract buildObject(): T;

		build(): T {
			let obj = this.buildObject();

			return Object.freeze(obj);
		}

	}

	class Hero {

		private name: string;

		private power: string;

		private constructor() {}

		getName(): string {
			return this.name;
		}

		getPower(): string {
			return this.power;
		}

		static Builder = class Builder {

			private name: string;

			private power: string;

			constructor(name: string) {
				this.name = name;
			}

			withPower(power: string): Builder {
				this.power = power;
				return this;
			}

			build(): Hero {
				let hero = new Hero();

				hero.name = this.name;
				hero.power = this.power;

				return hero;
			}
		};

		static OtherBuilder = class OtherBuilder extends Hero.Builder {

			private static readonly defaultName = 'Bruce';

			constructor() {
				super(OtherBuilder.defaultName);
			}

		}
	}

	it('should create hero', () => {

		// given
		let heroName = 'Batman',
			heroPower = 'money';

		// when
		let hero = new Hero.Builder(heroName).withPower(heroPower)
											 .build();

		// then
		expect(hero instanceof Hero).toBeTruthy();
		expect(hero.getName()).toEqual(heroName);
		expect(hero.getPower()).toEqual(heroPower);
	});

	class ImmutableHero {

		private name: string;

		private power: string;

		private constructor() {
		}

		getName(): string {
			return this.name;
		}

		getPower(): string {
			return this.power;
		}

		static Builder = class Builder extends ImmutableBuilder<ImmutableHero> {

			private name: string;

			private power: string;

			constructor(name: string) {
				super();
				this.name = name;
			}

			withPower(power: string): Builder {
				this.power = power;
				return this;
			}

			buildObject(): ImmutableHero {
				let immutableHero = new ImmutableHero();

				immutableHero.name = this.name;
				immutableHero.power = this.power;

				return immutableHero;
			}
		};
	}

	// given
	let heroName = 'Batman',
		heroPower = 'money';

	it('should create immutable hero', () => {

		// when
		let immutableHero = new ImmutableHero.Builder(heroName).withPower(heroPower)
															   .build();

		// then
		expect(immutableHero instanceof ImmutableHero).toBeTruthy();
		expect(immutableHero.getName()).toEqual(heroName);
		expect(immutableHero.getPower()).toEqual(heroPower);
	});

	it('should be able to change heroes values', () => {

		// given
		let immutableHero = new ImmutableHero.Builder(heroName).withPower(heroPower)
															   .build();

		// when
		(immutableHero as any).name = 'Clark Kent';

		// then
		expect(immutableHero.getName()).toEqual(heroName);
	});

});
