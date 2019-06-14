import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const defaultProperties: Component = {
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
};

export class BaseComponentProperties extends Component {

	constructor(properties: Component) {
		super(null);
		Object.assign(this, properties, defaultProperties);
	}

}
