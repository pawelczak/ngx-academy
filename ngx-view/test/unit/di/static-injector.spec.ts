import { Injector, StaticProvider } from '@angular/core';


describe('StaticInjector -', () => {

	class Record {}

	/**
	 *
	 * static create(options: {
		providers: StaticProvider[];
		parent?: Injector;
		name?: string;
	 }): Injector;
	 */
	describe('create -', () => {



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


	/**
	 * There is no public method to get all records from Injector.
	 * Although there should be a couple of methods how to do that.
	 *
	 */
	describe('get all Records', () => {

		let givenProviders: Array<StaticProvider>,
			notFoundValue = 'Bruce Wayne';

		/**
		 * Public method toString on StaticInjector returns
		 * all the names of the records in the injector scope.
		 * It should be possible to get all the records by their
		 * names.
		 */
		describe('toString() -', () => {

			it('should be possible to get all Records by their names', () => {

				// given
				const injector = createInjectorWithRecords(),
					foundRecords = new Map<any, any>();

				// when
				let records = injector.toString();
				let tokens = parseRecordNames(records);

				// then
				expect(tokens.length).toBe(givenProviders.length + 1); // records + injector

				tokens.forEach((token: string) => {

					let record = injector.get(token, notFoundValue);

					if (record !== notFoundValue) {
						foundRecords.set(token, record);
					}

					expect(injector.get(token, notFoundValue)).toBeDefined();
				});

				expect(foundRecords.size).toBe(1);
				expect(foundRecords.get('HERO')).toBeDefined();

				/**
				 * Conclusion
				 * It is possible to only get records that have string tokens
				 */
			});

			function parseRecordNames(records: string): Array<string> {
				let splitRecords = records.split('[')[1];
				let tokens = (splitRecords.split(']')[0]).split(', ');

				return tokens;
			}

		});

		function createInjectorWithRecords(): Injector {

			givenProviders = [
				{
					provide: Record,
					useClass: Record,
					deps: []
				} as StaticProvider,
				{
					provide: 'HERO',
					useValue: 'Batman',
					deps: []
				} as StaticProvider,
			];

			return Injector.create({providers: givenProviders});
		}

	});

	xit('should be possible to get all records from StaticInjector', () => {

		Injector.create({providers: []});

	});


});
