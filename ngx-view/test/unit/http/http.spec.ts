import { Injectable } from '@angular/core';
import {
	HttpErrorResponse, HttpParams,
	HttpResponse
} from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Car, CarsService } from './helpers/helpers';


describe('HttpClient -', () => {

	let carsService: CarsService,
		httpMock: HttpTestingController;

	const cars = [new Car('combi'), new Car('suv')];

	describe('basic http calls -', () => {

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


		it('mock simple http calls', (done) => {

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

		it('should return type of request and params', (done) => {

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

		it('should handle errors', (done) => {

			// given
			const url = 'cars',
				errorMessage = {'error': 'Error message'},
				errorStatus = 500;

			// when & then
			carsService
				.getCars(url)
				.subscribe(
					(next) => {
					},
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

		it('should return Http params', (done) => {

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


		it('should return response as a text', (done) => {

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

		it('should return a Response as a response', (done) => {

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

		describe('post', () => {

			it('should mock post request', (done) => {

				// when & then
				carsService.postCar().subscribe((returnedCar) => {
					expect(returnedCar).toEqual(cars[0]);
					expect(returnedCar instanceof Car).toBeTruthy();
					expect(returnedCar.getType()).toBe(cars[0].getType());
					done();
				});

				httpMock.expectOne('cars')
					.flush(cars[0]);
			});
		});

		describe('put', () => {

			it('should mock put request', (done) => {

				// when & then
				carsService.putCar().subscribe((returnedCar) => {
					expect(returnedCar).toEqual(cars[0]);
					expect(returnedCar instanceof Car).toBeTruthy();
					expect(returnedCar.getType()).toBe(cars[0].getType());
					done();
				});

				httpMock.expectOne('cars')
					.flush(cars[0]);
			});
		});

		describe('delete', () => {

			it('should mock delete request', (done) => {

				// when & then
				carsService.deleteCar().subscribe((returnedCar) => {
					expect(returnedCar).toEqual(cars[0]);
					expect(returnedCar instanceof Car).toBeTruthy();
					expect(returnedCar.getType()).toBe(cars[0].getType());
					done();
				});

				httpMock.expectOne('cars')
					.flush(cars[0]);
			});
		});

	});

});
