import { Injectable } from '@angular/core';
import {
	HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest,
	HttpResponse
} from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { filter, map, tap } from 'rxjs/operators';


describe('HttpClient -', () => {

	class Car {
		constructor(private type: string) {}

		getType(): string {
			return this.type;
		}
	}

	@Injectable()
	class CarsService {

		constructor(public httpClient: HttpClient) {}

		getCars(url = 'cars', params?: HttpParams) {
			return this.httpClient.get<Array<Car>>(url, { params });
		}

	}

	let carsService: CarsService,
		httpMock: HttpTestingController;

	const cars = [new Car('combi'), new Car('suv')];

	describe ('basic http calls -', () => {

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						HttpClientTestingModule
					],
					providers: [
						CarsService
					]
				});

			const injector = getTestBed();
			carsService = injector.get(CarsService);
			httpMock = injector.get(HttpTestingController);
		});

		afterEach(() => {
			httpMock.verify();
		});


		it ('mock simple http calls', (done) => {

			// when & then
			carsService.getCars().subscribe((requestedCars) => {
				expect(requestedCars).toEqual(cars);
				expect(requestedCars[0] instanceof Car).toBeTruthy();
				expect(requestedCars[0].getType()).toBe(cars[0].getType());
				done();
			});

			httpMock.expectOne('cars')
				.flush(cars);
		});

		it ('should return type of request and params', (done) => {

			// given
			const url = 'cars?max=100';

			// when & then
			carsService.getCars(url).subscribe((requestedCars) => {
				expect(requestedCars).toEqual(cars);
				done();
			});

			const request = httpMock.expectOne(url);
			expect(request.request.url).toBe(url);
			expect(request.request.params).toEqual(new HttpParams());

			request.flush(cars);
		});

		it ('should handle errors', (done) => {

			// given
			const url = 'cars',
				errorMessage = {'error': 'Error message'},
				errorStatus = 500;

			// when & then
			carsService
				.getCars(url)
				.subscribe(
					(next) => {},
					(error: HttpErrorResponse) => {
						expect(error.status).toEqual(errorStatus);
						expect(error.error).toEqual(errorMessage);
						done();
					}
				);

			const request = httpMock.expectOne(url);
			request.flush(
						errorMessage,
						{status: errorStatus, statusText: 'Server error'}
					);
		});

		it ('should return Http params', (done) => {

			// given
			const url = 'cars';
			const params = new HttpParams().set('max', '200');

			// when & then
			carsService.getCars(url, params).subscribe((requestedCars) => {
				expect(requestedCars).toEqual(cars);
				done();
			});

			const request = httpMock.expectOne(url + '?max=200');
			expect(request.request.url).toBe(url);
			expect(request.request.params).toEqual(params);

			request.flush(cars);
		});


		it ('should return response as a text', (done) => {

			// given
			const url = 'cars';
			const expectedResponse = JSON.stringify(cars);

			// when & then
			carsService.httpClient.get(url, {responseType: 'text'})
				.subscribe((requestedCars) => {
					expect(requestedCars).toEqual(expectedResponse);
					done();
				});

			const request = httpMock.expectOne(url);
			request.flush(cars);
		});

		it ('should return a Response as a response', (done) => {

			// given
			const url = 'cars';

			// when & then
			carsService.httpClient.get(url, {observe: 'response'})
				.subscribe((response) => {
					expect(response instanceof HttpResponse).toBeTruthy();
					expect(response.status).toBe(200);
					expect(response.body).toEqual(cars);
					done();
				});

			const request = httpMock.expectOne(url);
			request.flush(cars);
		});

	});

	describe( 'interceptors -', () => {

		describe ('response success manipulation -', () => {

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

			it ('should reformat response', (done) => {

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


		describe ('response error manipulation -', () => {

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

			it ('should pass through only errors', (done) => {

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
						(next) => {},
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


		describe ('should work in order of declaration -', () => {

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

			it ('alphabetical interceptors injection', (done) => {

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

			it ('reverse order of interceptors', (done) => {

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

});
