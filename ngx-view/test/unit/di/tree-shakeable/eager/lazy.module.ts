import { NgModule } from '@angular/core';

import { EagerWithDepsService } from './eager-with-deps.service';

@NgModule({
	providers: [
		EagerWithDepsService
	]
})
export class LazyModule {
}
