import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode, StaticProvider } from '@angular/core'
import { AnotherAppModule } from './app/another-app/another-app.module';

import { InjectorModule } from './app/injector.module';
import { PlatformMarker } from './app/services/platform-marker';

declare var process: any;

if (process.env.ENV === 'production') {
	enableProdMode();
}

const staticProviders = [
	{
		provide: PlatformMarker,
		useClass: PlatformMarker,
		deps: []
	} as StaticProvider
];

platformBrowserDynamic([staticProviders]).bootstrapModule(InjectorModule, );

platformBrowserDynamic().bootstrapModule(AnotherAppModule, [{providers: staticProviders}]);
