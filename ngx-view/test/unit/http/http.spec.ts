import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('HttpClient -', () => {

	class Car {
		constructor(private type: string) {}

		getType(): string {
			return this.type;
		}
	}

	@Injectable()
	class CarsService {

		constructor(private httpClient: HttpClient) {}

		getCars(url = 'cars', params?: HttpParams) {
			return this.httpClient.get<Array<Car>>(url, { params });
		}

	}

	let carsService: CarsService,
		httpMock: HttpTestingController;

	const cars = [new Car('combi'), new Car('suv')];

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
		const url = 'cars';

		// when & then
		carsService
			.getCars(url)
			.subscribe(
				(next) => {},
				(error) => {
					done();
				}
			);

		const request = httpMock.expectOne(url);
		request.error(new ErrorEvent(null, null));
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

});
