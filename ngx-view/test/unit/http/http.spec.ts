import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('Dependency injection - providers -', () => {

	class Car {
		constructor(private type: string) {}

		getType(): string {
			return this.type;
		}
	}

	@Injectable()
	class CarsService {

		constructor(private httpClient: HttpClient) {}

		getCars() {
			return this.httpClient.get<Array<Car>>('cars');
		}

	}

	let carsService: CarsService,
		httpMock: HttpTestingController;

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


	it ('mock simple http calls', () => {

		// given
		const cars = [new Car('combi'), new Car('suv')];

		// when & then
		carsService.getCars().subscribe((requestedCars) => {
			expect(requestedCars).toEqual(cars);
			expect(requestedCars[0] instanceof Car).toBeTruthy();
			expect(requestedCars[0].getType()).toBe(cars[0].getType());
		});

		httpMock.expectOne('cars')
			.flush(cars);
	});

});
