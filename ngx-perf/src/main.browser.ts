import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode } from '@angular/core'

import { AppModule } from './app/app.module';

declare var process: any;

enableProdMode();

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		ngZone: 'noop'
	})
	.then(() => {
	});
