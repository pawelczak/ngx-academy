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

	it('should be possible to create own observable', (done) => {

		// given
		const givenHeroes = [
				new Hero('Magento'),
				new Hero('DeadPool'),
				new Hero(heroNames[0]),
				new Hero(heroNames[1])
			],
			expectedHeores = [...givenHeroes];

		const heroes$ = new HeroObservable((observer: Observer<Hero>) => {
			givenHeroes.forEach((h: Hero) => {
				observer.next(h);
			});
			observer.complete();
		});

		const actualHeroes: Array<Hero> = [];

		// when
		heroes$
			.pipe(
				tap((h: Hero) => actualHeroes.push(h)),
				count()
			)
			.subscribe((h: any) => {

				// then
				expect(actualHeroes).toEqual(expectedHeores);
				done();
			});

	});

});
