import { Injector, StaticProvider } from '@angular/core';


describe('StaticInjector -', () => {

	class Record {}

	class OtherRecord {}

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

		it('should create Injector based on providers and parent injector', () => {

			// given
			const parentInjector = createParentInjector(),
				providers = [{
					provide: OtherRecord,
					useClass: OtherRecord,
					deps: []
				} as StaticProvider],
				expectedContext = `StaticInjector[Injector, OtherRecord]`;

			// when
			const injector = Injector.create({providers, parent: parentInjector});

			// then
			const records = (injector as any)._records;

			expect(records.size).toBe(2);
			expect(injector.toString()).toEqual(expectedContext);
			expect(injector.get(OtherRecord)).toBeDefined();
			expect(injector.get(Injector)).toBeDefined();

			function createParentInjector(): Injector {
				const parentProviders = [
						{
							provide: Record,
							useClass: Record,
							deps: []
						} as StaticProvider
					],
					parentInjector = Injector.create({providers: parentProviders});

				return parentInjector;
			}
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

	describe('record creation -', () => {

		let recordCreated = false;

		class Record {
			constructor() {
				recordCreated = true;
			}
		}

		let injector: Injector;

		beforeEach(() => {
			recordCreated = false;
			injector = InjectorCreator.create();
		});

		it('should not create object before it is requested', () => {

			// then
			expect(recordCreated).toBeFalsy();
		});

		/**
		 * When Record is a class, object from that class should be created
		 * when the record is requested.
		 */
		it('should create object when it is requested', () => {

			// when
			injector.get(Record);

			// then
			expect(recordCreated).toBeTruthy();
		});


		class InjectorCreator {
			static providers = [{
				provide: Record,
				useClass: Record,
				deps: []
			} as StaticProvider];

			static create(): Injector {
				return Injector.create({providers: InjectorCreator.providers});
			}
		}
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
					foundedRecords = new Map<any, any>();

				// when
				let records = injector.toString();
				let tokens = parseRecordNames(records);

				// then
				expect(tokens.length).toBe(givenProviders.length + 1); // records + injector

				tokens.forEach((token: string) => {

					let record = injector.get(token, notFoundValue);

					if (record !== notFoundValue) {
						foundedRecords.set(token, record);
					}

					expect(injector.get(token, notFoundValue)).toBeDefined();
				});

				expect(foundedRecords.size).toBe(1);
				expect(foundedRecords.get('HERO')).toBeDefined();

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

		/**
		 * To get all records from a injector we can use the private property
		 * on a injector object called '_records'. This property is a Map,
		 * where key represents token and value it provider/record.
		 */
		describe('_records -', () => {

			it ('should be possible to get records from private property _records', () => {

				// given
				const injector = createInjectorWithRecords(),
					foundedRecords = new Map();

				// when
				(injector as any)._records.forEach((value: any, key: any) => {

					let record = injector.get(key, foundedRecords);

					foundedRecords.set(key, record);
				});

				// when
				expect(foundedRecords.size).toBe(givenProviders.length + 1); // records + injector

				/**
				 * This method allows to get all the tokens and records from a injector.
				 */
			});
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

});
