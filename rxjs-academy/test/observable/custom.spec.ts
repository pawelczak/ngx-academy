import { Observable, Operator, Observer } from 'rxjs';
import { count, tap } from 'rxjs/operators';

describe('Observable - custom -', () => {

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

	const givenHeroes = [
			new Hero('Magento'),
			new Hero('DeadPool'),
			new Hero(heroNames[0]),
			new Hero(heroNames[1])
		],
		expectedHeores = [...givenHeroes];
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
				expect(actualHeroes).toEqual(expectedHeores);
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
