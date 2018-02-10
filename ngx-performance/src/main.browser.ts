import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode } from '@angular/core'

import { AppModule } from './app/app.module';

declare var window: any;
declare var process: any;

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.then(() => {
		window.timeToBootstrap = Date.now() - performance.timing.navigationStart;
		// console.log('timeToBootstrap', window.timeToBootstrap);
	});
