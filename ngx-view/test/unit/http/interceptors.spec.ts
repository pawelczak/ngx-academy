import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { Car, CarsService } from './helpers/helpers';


describe('Http - interceptors -', () => {

	let carsService: CarsService,
		httpMock: HttpTestingController;

	const cars = [new Car('combi'), new Car('suv')];


	describe('response -', () => {

		describe('success manipulation -', () => {

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


		describe('error manipulation -', () => {

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
