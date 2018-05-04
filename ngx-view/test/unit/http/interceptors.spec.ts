import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Car, CarsService } from './helpers/helpers';


describe('Http - interceptors -', () => {

	let carsService: CarsService,
		httpMock: HttpTestingController;

	const cars = [new Car('combi'), new Car('suv')];

	/**
	 * Interceptors allows to manipulate the response of http call.
	 */
	describe('response -', () => {

		/**
		 * It's possible to modify successful responses.
		 */
		describe('success -', () => {

			class CarsCounterInterceptor implements HttpInterceptor {

				intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

					return next.handle(request)
						.pipe(
							map((response: any) => {

								if (response.status === 200) {
									const newResponse = response.clone();
									const newBody = {
										cars: response.body,
										numberOfCars: response.body.length
									};

									newResponse.body = newBody;

									return newResponse;
								} else {
									return response;
								}
							})
						);
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							HttpClientTestingModule
						],
						providers: [
							CarsService,
							{
								provide: HTTP_INTERCEPTORS,
								useClass: CarsCounterInterceptor,
								multi: true,
							}
						]
					});

				const injector = getTestBed();
				carsService = injector.get(CarsService);
				httpMock = injector.get(HttpTestingController);
			});

			it('should reformat response', (done) => {

				// given
				const url = 'cars',
					expectedResponse = {
						cars: cars,
						numberOfCars: cars.length
					};

				// when & then
				carsService
					.getCars(url)
					.subscribe((res: any) => {
						expect(res).toEqual(expectedResponse);
						done();
					});

				const emptyRequest = httpMock.expectOne(url);
				emptyRequest.flush(cars);
			});

		});

		/**
		 * It's also possible to modify responses with errors.
		 */
		describe('error -', () => {

			class OnlyErrorsInterceptor implements HttpInterceptor {

				intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

					return next.handle(request)
						.pipe(
							filter((response: any) => {
								return response.status === 500;
							})
						);
				}
			}

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							HttpClientTestingModule
						],
						providers: [
							CarsService,
							{
								provide: HTTP_INTERCEPTORS,
								useClass: OnlyErrorsInterceptor,
								multi: true,
							}
						]
					});

				const injector = getTestBed();
				carsService = injector.get(CarsService);
				httpMock = injector.get(HttpTestingController);
			});

			afterEach(() => {
				httpMock.verify();
			});

			it('should pass through only errors', (done) => {

				// given
				const errorUrl = 'cars/errors',
					successUrl = 'cars/success',
					errorMessage = {'error': 'Error message'},
					errorStatus = 500;

				// when & then
				carsService
					.getCars(successUrl)
					.subscribe((next) => {
						expect(next).not.toHaveBeenCalled();
					});

				carsService
					.getCars(errorUrl)
					.subscribe(
						(next) => {
						},
						(error) => {
							expect(error.status).toEqual(errorStatus);
							expect(error.error).toEqual(errorMessage);
							done();
						}
					);

				const emptyRequest = httpMock.expectOne(successUrl);
				emptyRequest.flush({});

				const request = httpMock.expectOne(errorUrl);
				request.flush(
					errorMessage,
					{status: errorStatus, statusText: 'Server error'}
				);
			});

		});
	});

	/**
	 * Interceptors allows to modify request, e.g. headers.
	 *
	 */
	describe('request -', () => {

		const headerKey = 'Accept-Payment',
			headerValue = 'Yes';

		class AddHeadersInterceptor implements HttpInterceptor {

			intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
				const req = request.clone({
					headers: request.headers.append(headerKey, headerValue)
				});
				return next.handle(req);
			}
		}

		class RemoveHeadersInterceptor implements HttpInterceptor {

			intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
				const req = request.clone({
					headers: request.headers.delete(headerKey)
				});
				return next.handle(req);
			}
		}

		/**
		 * Interceptor adds custom header to http headers.
		 */
		describe('add headers -', () => {

			const interceptors: Array<any> = [
				AddHeadersInterceptor
			];

			initTestContext(interceptors);

			afterEach(() => {
				httpMock.verify();
			});

			it('should add header to http headers', (done) => {

				// given
				const url = 'cars/success';

				// when & then
				carsService
					.getCars(url)
					.subscribe(() => {
						done();
					});

				const request = httpMock.expectOne(url);
				expect(request.request.headers.has(headerKey)).toBe(true);
				expect(request.request.headers.get(headerKey)).toBe(headerValue);
				request.flush({});
			});
		});

		/**
		 * First interceptor adds header to http headers.
		 * Second interceptor removes header.
		 * Interceptors are invoked in the order of declaration.
		 */
		describe('remove headers -', () => {

			const interceptors: Array<any> = [
				AddHeadersInterceptor,
				RemoveHeadersInterceptor
			];

			initTestContext(interceptors);

			afterEach(() => {
				httpMock.verify();
			});

			it('should remove header from http headers', (done) => {

				// given
				const url = 'cars/success';

				// when & then
				carsService
					.getCars(url)
					.subscribe(() => {
						done();
					});

				const request = httpMock.expectOne(url);
				expect(request.request.headers.has(headerKey)).not.toBe(true);
				request.flush({});
			});
		});

		function initTestContext(interceptros: Array<any>) {

			let providers: Array<any> = [];

			interceptros.forEach((interceptor: any) => {
				providers.push({
					provide: HTTP_INTERCEPTORS,
					useClass: interceptor,
					multi: true
				})
			});

			providers.push(CarsService);

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							HttpClientTestingModule
						],
						providers: providers
					});

				const injector = getTestBed();
				carsService = injector.get(CarsService);
				httpMock = injector.get(HttpTestingController);
			});
		}
	});


	/**
	 * Interceptors should work in order of declarations.
	 */
	describe('order of declaration -', () => {

		let intercepts: Array<string> = [];

		class FirstInterceptor implements HttpInterceptor {

			intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

				intercepts.push('first');

				return next.handle(request);
			}
		}

		class SecondInterceptor implements HttpInterceptor {

			intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

				intercepts.push('second');

				return next.handle(request);
			}
		}

		it('alphabetical interceptors injection', (done) => {

			// given
			TestBed
				.configureTestingModule({
					imports: [
						HttpClientTestingModule
					],
					providers: [
						CarsService,
						{
							provide: HTTP_INTERCEPTORS,
							useClass: FirstInterceptor,
							multi: true,
						},
						{
							provide: HTTP_INTERCEPTORS,
							useClass: SecondInterceptor,
							multi: true,
						}
					]
				});

			const url = 'cars';
			const injector = getTestBed();
			carsService = injector.get(CarsService);
			httpMock = injector.get(HttpTestingController);
			intercepts = [];

			carsService.getCars(url).subscribe(() => {
				expect(intercepts).toEqual(['first', 'second']);
				done();
			});

			const request = httpMock.expectOne(url);

			request.flush(cars);
		});

		it('reverse order of interceptors', (done) => {

			// given
			TestBed
				.configureTestingModule({
					imports: [
						HttpClientTestingModule
					],
					providers: [
						CarsService,
						{
							provide: HTTP_INTERCEPTORS,
							useClass: SecondInterceptor,
							multi: true,
						},
						{
							provide: HTTP_INTERCEPTORS,
							useClass: FirstInterceptor,
							multi: true,
						}
					]
				});

			const url = 'cars';
			const injector = getTestBed();
			carsService = injector.get(CarsService);
			httpMock = injector.get(HttpTestingController);
			intercepts = [];

			carsService.getCars(url).subscribe(() => {
				expect(intercepts).toEqual(['second', 'first']);
				done();
			});

			const request = httpMock.expectOne(url);

			request.flush(cars);
		});

	});

});
