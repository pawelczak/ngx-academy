import { Observable, Operator, Observer } from 'rxjs';
import { count, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Rx';

describe('Observable -', () => {

	const heroNames = [
		'Wolverine',
		'Because I\'m Batman'
	];

	class Hero {
		constructor(public name: string) {}
	}

	class HeroObservable<T = Hero> extends Observable<T> {

		lift<R>(operator: Operator<T, R>): Observable<R> {
			const observable = new HeroObservable<R>(); //<-- important part here
			observable.source = this;
			observable.operator = operator;
			return observable;
		}

		isHero<T2 extends T>(...heroNames: Array<string>): any {
			return (this as HeroObservable<any>).filter((hero: Hero) => {
				return heroNames.some((name: string) => name === hero.name);
			});
		}
	}

	describe('custom -', () => {

		const givenHeroes = [
				new Hero('Magneto'),
				new Hero('DeadPool'),
				new Hero(heroNames[0]),
				new Hero(heroNames[1])
			],
			expectedHeroes = [...givenHeroes];
		let actualHeroes: Array<Hero> = [],
			heroes$: HeroObservable = new HeroObservable((observer: Observer<Hero>) => {
				givenHeroes.forEach((h: Hero) => {
					observer.next(h);
				});
				observer.complete();
			});

		beforeEach(() => {
			actualHeroes = [];
		});

		it('should be possible to create own observable', (done) => {

			// when
			heroes$
				.pipe(
					tap((h: Hero) => actualHeroes.push(h)),
					count()
				)
				.subscribe(() => {

					// then
					expect(actualHeroes).toEqual(expectedHeroes);
					done();
				});
		});

		it('should use custom operator', (done) => {

			// when
			heroes$
				.isHero(...heroNames)
				.pipe(
					tap((h: Hero) => actualHeroes.push(h)),
					count()
				)
				.subscribe(() => {

					// then
					expect(actualHeroes.length).toEqual(2);
					expect(actualHeroes[0].name).toEqual(heroNames[0]);
					expect(actualHeroes[1].name).toEqual(heroNames[1]);
					done();
				});
		});

	});

	describe('Observable from other observable-', () => {

		class UberHeroObservable<T = Hero> extends Observable<T> {

			constructor(source?: Observable<T>) {
				super();

				if (source) {
					this.source = source;
				}
			}
		}

		it('create observable from subject', (done) => {

			const subject = new Subject(),
				heroes$ = new UberHeroObservable(subject),
				givenHero = new Hero('Logan');

			heroes$
				.subscribe((hero: Hero) => {

					// then
					expect(hero).toEqual(givenHero);
					done();
				});

			// when
			subject.next(givenHero);
		});

	});

});
