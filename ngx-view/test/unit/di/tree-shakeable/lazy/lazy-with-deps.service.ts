import { Injectable } from '@angular/core';

import { EagerService } from './eager.service';
import { LazyWithDepsModule } from './lazy-with-deps.module';

@Injectable({
	providedIn: LazyWithDepsModule
})
export class LazyWithDepsService {
	constructor(public eagerService: EagerService) {}
}
