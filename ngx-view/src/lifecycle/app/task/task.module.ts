import { NgModule } from '@angular/core';

import { TaskComponent } from './task.component';

@NgModule({
	imports: [
	],
	declarations: [
		TaskComponent
	],
	providers: [
		{
			provide: 'token',
			useValue: 'b',
			multi: true
		}
	],
	entryComponents: [
	]
})
export class TaskModule {
}

