describe('Constructor -', () => {

    describe('optional parameters -', () => {

        class Car {

            constructor(private readonly name: string,
                        private readonly producer?: string,
                        private readonly prize?: number) {
            }

            getName(): string {
                return this.name;
            }

            getProducer(): string {
                return this.producer;
            }

            getPrize(): number {
                return this.prize;
            }
        }

        const givenName = 'Chiron',
            givenProducer = 'Bugatti',
            givenPrize = 123456;

        it('should be possible to create object without passing optional arguments', () => {

            // when
            const car = new Car(givenName);

            // then
            expect(car instanceof Car).toBeTruthy();
            expect(car.getName()).toBe(givenName);
            expect(car.getProducer()).toBe(undefined);
            expect(car.getPrize()).toBe(undefined);
        });

        it('should be possible to create car object with only name and producer', () => {

            // when
            const car = new Car(givenName, givenProducer);

            // then
            expect(car instanceof Car).toBeTruthy();
            expect(car.getName()).toBe(givenName);
            expect(car.getProducer()).toBe(givenProducer);
            expect(car.getPrize()).toBe(undefined);
        });

        it('should be possible to create car with name and prize, without a producer', () => {

            // when
            const car = new Car(
                givenName,
                undefined, // could be also null
                givenPrize);

            // then
            expect(car instanceof Car).toBeTruthy();
            expect(car.getName()).toBe(givenName);
            expect(car.getProducer()).toBe(undefined);
            expect(car.getPrize()).toBe(givenPrize);
        });
    });

    describe('default value', () => {

        class Coffee {

            static DEFAULT_ACIDITY: number = 3;

            static DEFAULT_SWEETNESS: number = 3;

            constructor(private readonly name: string,
                        private readonly acidity: number = Coffee.DEFAULT_ACIDITY,
                        private readonly sweetness: number = Coffee.DEFAULT_SWEETNESS) {
            }

            getName(): string {
                return this.name;
            }

            getAcidity(): number {
                return this.acidity;
            }

            getSweetness(): number {
                return this.sweetness;
            }
        }

        const givenName = 'Piccolo Latte',
            givenAcidity = 1,
            givenSweetness = 4;


        it('should be possible to create coffee object with default values', () => {

            // when
            const coffee = new Coffee(givenName);

            // then
            expect(coffee.getName()).toBe(givenName);
            expect(coffee.getAcidity()).toBe(Coffee.DEFAULT_ACIDITY);
            expect(coffee.getSweetness()).toBe(Coffee.DEFAULT_SWEETNESS);
        });

        it('should be possible to create coffee object with different acidity', () => {

            // when
            const coffee = new Coffee(
                givenName,
                givenAcidity);

            // then
            expect(coffee.getName()).toBe(givenName);
            expect(coffee.getAcidity()).toBe(givenAcidity);
            expect(coffee.getSweetness()).toBe(Coffee.DEFAULT_SWEETNESS);
        });

        it('should be possible to create coffee object with only different sweetness', () => {

            // when
            const coffee = new Coffee(
                givenName,
                undefined,
                givenSweetness);

            // then
            expect(coffee.getName()).toBe(givenName);
            expect(coffee.getAcidity()).toBe(Coffee.DEFAULT_ACIDITY);
            expect(coffee.getSweetness()).toBe(givenSweetness);
        });

        it('should be possible to create coffee object with only different sweetness, acidity as null', () => {

            // when
            const coffee = new Coffee(
                givenName,
                null,
                givenSweetness);

            // then
            expect(coffee.getName()).toBe(givenName);
            expect(coffee.getAcidity()).toBe(null);
            expect(coffee.getAcidity()).not.toBe(Coffee.DEFAULT_ACIDITY);
            expect(coffee.getSweetness()).toBe(givenSweetness);
        });

    });

    describe('optional & default values', () => {

        class Keyboard {

            static DEFAULT_NUMBER_OF_KEYS: number = 84;

            constructor(private readonly name: string,
                        private readonly mechanical?: boolean,
                        private readonly keys: number = Keyboard.DEFAULT_NUMBER_OF_KEYS) {
            }

            getName(): string {
                return this.name;
            }

            isMechanical(): boolean {
                return this.mechanical;
            }

            getNumberOfKeys(): number {
                return this.keys;
            }
        }

        const givenName = 'Razer Chroma',
            enhancedNumberOfKeys = 101;

        it('should be possible to create basic keyboard', () => {

            // when
            const keyboard = new Keyboard(givenName);

            // then
            expect(keyboard.getName()).toEqual(givenName);
            expect(keyboard.isMechanical()).toBeUndefined();
            expect(keyboard.getNumberOfKeys()).toEqual(Keyboard.DEFAULT_NUMBER_OF_KEYS);
        });

    });

});
