import { TestBed } from '@angular/core/testing';

import { EagerWithDepsService } from './eager/eager-with-deps.service';
import { LazyModule } from './eager/lazy.module';

import { EagerService } from './lazy/eager.service';
import { LazyWithDepsModule } from './lazy/lazy-with-deps.module';
import { LazyWithDepsService } from './lazy/lazy-with-deps.service';


describe('Tree shakeable providers -', () => {

	describe('dependencies -', () => {

		/**
		 * "Lazy" services are able to inject eager services.
		 */
		describe('lazy injects eager -', () => {

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							LazyWithDepsModule
						]
					});
			});

			it('should create lazy service with eager dependencies', () => {

				// given & when
				let service = TestBed.get(LazyWithDepsService);

				// then
				expect(service.eagerService).toBeDefined();
				expect(service instanceof LazyWithDepsService).toBeTruthy();
				expect(service.eagerService instanceof EagerService).toBeTruthy();
			});
		});

		/**
		 * "Eager" services are able to inject lazy.
		 */
		describe('eager injects lazy -', () => {

			beforeEach(() => {
				TestBed
					.configureTestingModule({
						imports: [
							LazyModule
						]
					});
			});

			it('should create eager service with lazy dependency', () => {

				// when & then
				expect(() => TestBed.get(EagerWithDepsService)).toThrowError();
			});
		});

	});

});
