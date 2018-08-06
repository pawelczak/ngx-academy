import { Component, Injector, Inject, Optional } from '@angular/core';
import { PlatformMarker } from './services/platform-marker';
import { ProvidedRoot } from './services/provided-root';


@Component({
	selector: 'app-injectors',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.ngx.scss'
	],
	providers: [
		// { provide: 'Component marker', useValue: '2'}
	]
})
export class AppComponent {

	constructor(@Optional() public bootstrapMarker: PlatformMarker,
				@Optional() public providedRoot: ProvidedRoot,
				@Optional() @Inject('Module marker') public moduleMarker: any,
				@Optional() @Inject('Component marker') public componentMarker: any,) {
	}

}
