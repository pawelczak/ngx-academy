import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';


/**
 * Different method should be used to resolve / finish micro & macro tasks
 *
 * Macrotasks:
 * - setTimeout,
 * - setInterval,
 * - setImmediate,
 * - requestAnimationFrame,
 * - I/O,
 * - UI rendering
 *
 * Microtasks:
 * - Promises,
 * - process.nextTick,
 * - Object.observe,
 * - MutationObserver
 *
 */
describe('Function fakeAsync -', () => {

	/**
	 * Function setTimeout puts task to do in micro task queue,
	 * it also represents a macrotask
	 *
	 */
	describe('setTimeout -', () => {

		let timerFinished = false;
		let timer: any;

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
			flush();
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

	/**
	 * Promise is representation of microtask
	 */
	describe('Promise -', () => {

		let promiseFinised = false;

		let promise = Promise.resolve(true);

		it('should not resolve by itself', fakeAsync(() => {

			// given
			promiseFinised = false;

			// when
			promise.then(() => promiseFinised = true);

			// then
			expect(promiseFinised).toBeFalsy();
		}));

		it('should be resolved with flushMicroTasks', fakeAsync(() => {

			// given
			promiseFinised = false;

			// when
			promise.then(() => promiseFinised = true);
			flushMicrotasks();

			// then
			expect(promiseFinised).toBeTruthy();
		}));

	});

});
