import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Car {
	constructor(private type: string) {}

	getType(): string {
		return this.type;
	}
}

@Injectable()
export class CarsService {

	constructor(public httpClient: HttpClient) {}

	getCars(url = 'cars', params?: HttpParams, headers?: any) {
		return this.httpClient.get<Array<Car>>(url, { params, headers });
	}

	postCar(url = 'cars', params?: any) {
		return this.httpClient.post<Car>(url, { params });
	}

	putCar(url = 'cars', params?: any) {
		return this.httpClient.put<Car>(url, { params });
	}

	deleteCar(url = 'cars', params?: any) {
		return this.httpClient.delete<Car>(url, { params });
	}
}
