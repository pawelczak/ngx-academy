import { Injector, StaticProvider } from '@angular/core';


describe('StaticInjector -', () => {

	/**
	 *
	 * static create(options: {
		providers: StaticProvider[];
		parent?: Injector;
		name?: string;
	 }): Injector;
	 */
	describe('create -', () => {

		class Record {}

		it('should be possible to create Injector with providers', () => {

			// given
			const providers: Array<StaticProvider> = [
				{
					provide: Record,
					useClass: Record,
					deps: []
				} as StaticProvider
			];

			// when
			const injector = Injector.create({providers});

			// then
			const record = injector.get(Record);

			expect(record instanceof Record).toEqual(true);
		});

		/**
		 * Empty injector has only one record - reference to itself
		 */
		it('should be possible to create empty Injector', () => {

			const emptyInjector = Injector.create({providers: []});

			expect((emptyInjector as any)._records.size).toBe(1);
			expect(emptyInjector.get(Injector)).toBe(emptyInjector);
		});

	});



	xit('should be possible to get all records from StaticInjector', () => {

		Injector.create({providers: []});

	});


});
