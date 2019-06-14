import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const genericComponentArgs: Component = {
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
};

export function BaseComponent(args: Component = {}): (cls: any) => void {

	const componentArgs = Object.assign(genericComponentArgs as Component, args),
		ngCompDecorator = Component(componentArgs);

	return function(compType: any) {
		ngCompDecorator(compType);
	};
}
