import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';


describe('Function fakeAsync -', () => {

	let timer: any;
	let promise = () => {
		return new Promise((resolve) => {
			timer = setTimeout(() => {
						resolve();
					}, 10);
		});
	};

	describe('timer', () => {

		let timerFinished = false;

		function startTimer() {
			timer = setTimeout(() => {
				timerFinished = true;
			}, 10);
		}

		/**
		 * setTimeout runs after 10 sec, so tick(9) is not enough
		 */
		it ('should not run setTimeout', fakeAsync(() => {

			// given
			timerFinished = false;

			// when
			startTimer();
			tick(9);

			// then
			expect(timerFinished).not.toBeTruthy();
			clearTimeout(timer);
		}));

		/**
		 * tick(10) is enough time for setTimeout to finish
		 */
		it ('should finish timer in setTimeout', fakeAsync(() => {

			// given
			timerFinished = false;

			// when
			startTimer();
			tick(10);

			// then
			expect(timerFinished).toBeTruthy();
		}));

	});

});
