import { NgModule } from '@angular/core';

import { ProjectComponent } from './project.component';


@NgModule({
	imports: [
	],
	declarations: [
		ProjectComponent
	],
	providers: [
		{
			provide: 'token',
			useValue: 'a',
			multi: true
		}
	],
	entryComponents: [
	]
})
export class ProjectModule {
}

