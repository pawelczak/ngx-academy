import { Injectable } from '@angular/core';

import { LazyService } from './lazy.service';

@Injectable()
export class EagerWithDepsService {
	constructor(public lazyService: LazyService) {}
}
