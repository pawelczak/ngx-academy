import { Injector, StaticProvider, INJECTOR } from '@angular/core';


describe('StaticInjector -', () => {

	class Record {}

	class OtherRecord {}

	const numberOfRecordsInEmptyInjector = 2; // Injector + InjectionToken('INJECTOR') - INJECTOR

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
		 * Empty injector has two records:
		 * - reference to itself
		 * - InjectionToken INJECTOR which points to injector
		 */
		it('should be possible to create empty Injector', () => {

			const emptyInjector = Injector.create({providers: []});

			expect((emptyInjector as any)._records.size).toBe(numberOfRecordsInEmptyInjector);
			expect(emptyInjector.get(Injector)).toBe(emptyInjector);
			expect(emptyInjector.get(INJECTOR)).toBe(emptyInjector);
		});

		describe('with parent injector -', () => {

			let parentInjector: Injector,
				providers,
				expectedContext: string,
				injector: Injector;

			beforeEach(() => {
				parentInjector = ParentInjectorFactory.create();
				providers = [{
					provide: OtherRecord,
					useClass: OtherRecord,
					deps: []
				} as StaticProvider];
				expectedContext = `StaticInjector[Injector, InjectionToken INJECTOR, OtherRecord]`;

				injector = Injector.create({providers, parent: parentInjector});
			});

			it('should create Injector based on providers and parent injector', () => {

				// then
				const records = (injector as any)._records;

				expect(records.size).toBe(1 + numberOfRecordsInEmptyInjector);
				expect(injector.toString()).toEqual(expectedContext);
				expect(injector.get(OtherRecord)).toBeDefined();
				expect(injector.get(Injector)).toBeDefined();
				expect(injector.get(INJECTOR)).toBeDefined();
			});

			/**
			 * Although injector has only two records (class Record and reference to itself)
			 * method get will traverse the tree of injectors in order to find requested
			 * record. So method get will look inside parentInjector in order to find
			 * requested record.
			 */
			it('should be possible to get records from parent injector', () => {

				// then
				let record = (ParentInjectorFactory.parentProviders[0] as any).provide;

				expect(injector.get(record)).toBeDefined();
			});

			/**
			 * Injector should have access to parent injector
			 */
			it('should have access to parentInjector', () => {

				// then
				expect((injector as any).parent).toBe(parentInjector);
			});

			/**
			 * Root injector should have empty parent
			 */
			it('root injector shouldn\'t have parent', () => {

				// then
				const parent = (injector as any).parent;

				expect((parent as any).parent).toBe(Injector.NULL);
			});

			class ParentInjectorFactory {
				static parentProviders = [
					{
						provide: Record,
						useClass: Record,
						deps: []
					} as StaticProvider
				];

				static create(): Injector {
					return Injector.create({providers: ParentInjectorFactory.parentProviders});
				}
			}
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
			injector = InjectorFactory.create();
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


		class InjectorFactory {
			static providers = [{
				provide: Record,
				useClass: Record,
				deps: []
			} as StaticProvider];

			static create(): Injector {
				return Injector.create({providers: InjectorFactory.providers});
			}
		}
	});

	/**
	 * There is no public method to get all records from Injector.
	 * Although there should be a couple of methods how to do that.
	 *
	 */
	describe('get all Records -', () => {

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
				expect(tokens.length).toBe(givenProviders.length + numberOfRecordsInEmptyInjector); // records + injector + injector token

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
				expect(foundedRecords.size).toBe(givenProviders.length + numberOfRecordsInEmptyInjector); // records + injector + injectorToken

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
