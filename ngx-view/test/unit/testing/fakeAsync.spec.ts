import { fakeAsync, tick } from '@angular/core/testing';


describe('Function fakeAsync -', () => {

	let timer: any;
	let promise = () => {
		return new Promise((resolve) => {
			timer = setTimeout(() => {
						resolve();
					}, 10);
		});
	};

	/**
	 * setTimeout runs after 10 sec, so tick(9) is not enough
	 */
	it ('should not resolve promise', fakeAsync(() => {

		// given
		let promiseFinished = false;

		// when
		promise().then(() => promiseFinished = true);
		tick(9);

		// then
		expect(promiseFinished).not.toBeTruthy();
		clearTimeout(timer);
	}));

	/**
	 * tick(10) is enough time for promise to resolve
	 */
	it ('should resolve promise', fakeAsync(() => {

		// given
		let promiseFinished = false;

		// when
		promise().then(() => promiseFinished = true);
		tick(10);

		// then
		expect(promiseFinished).toBeTruthy();
	}));

});
