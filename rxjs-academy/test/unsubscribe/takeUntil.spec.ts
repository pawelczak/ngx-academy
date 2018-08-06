import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

describe('Unsubscribe - takeUntil -', () => {


	const unsubscribe$ = new Subject();




	fit ('should complete subscribed observable', (done) => {

		const source$ = interval(3);

		source$.pipe(
			takeUntil(unsubscribe$)
		)
			.subscribe((v) => {
				console.log(v);
				},
				null,
				() => {
				console.log('complete')
				})

		setTimeout(() => {
			unsubscribe$.next();
			unsubscribe$.complete();
			// unsubscribe$.next();

			unsubscribe$.next(1234);

		}, 10)

		unsubscribe$.subscribe((v) => console.log(v))


		setTimeout(() => {
			done()
		}, 50)

	});


});
