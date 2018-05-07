import { NgModule } from '@angular/core';

import { EagerService } from './eager.service';


@NgModule({
	providers: [
		EagerService
	]
})
export class LazyWithDepsModule {}
