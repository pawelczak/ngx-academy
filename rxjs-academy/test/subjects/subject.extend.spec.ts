import { Subject } from 'rxjs';

describe('Subject - custom -', () => {

	describe('wrapper -', () => {

		class WrapperSubject<T> extends Subject<T> {
		}

		it('should be possible to wrap subject', (done) => {

			// given
			let wrapperSubject = new WrapperSubject();


			wrapperSubject.subscribe(() => {

				// then
				done();
			});

			wrapperSubject.next('');

		});

	});

	describe('specific type -', () => {

		class Hero {}

		class TypedSubject<T extends Hero> extends Subject<T> {}

		it ('should allow to create TypedSubject of specific type', (done) => {

			const typeSubject = new TypedSubject(), // Tpechecking doesn't work :/
				hero = new Hero;

			typeSubject.subscribe(() => {

				// then
				done();
			});

			typeSubject.next(hero);
		})
	});

});
