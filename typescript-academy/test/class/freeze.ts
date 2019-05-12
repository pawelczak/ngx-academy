export function freeze(target: Function) {

	const original = target;

	function construct(constructor: any, args: Array<any>) {
		const originalConstructor: any = function() {
			return constructor.apply(this, args);
		};
		originalConstructor.prototype = constructor.prototype;
		return new originalConstructor();
	}

	const overriddenPrototype: any = function(...args: Array<any>) {
		console.log(`New: ${original['name']} is created`);
		const obj = construct(original, args);
		Object.freeze(obj);
		return obj;
	};

	overriddenPrototype.prototype = original.prototype;

	return overriddenPrototype;
}
