import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AnotherAppComponent } from './another-app.component';


@NgModule({
	imports: [
		BrowserModule
	],
	declarations: [
		AnotherAppComponent,
	],
	providers: [
		{ provide: 'Module marker', useValue: '6'}
	],
	entryComponents: [
	],
	bootstrap: [
		AnotherAppComponent
	]
})
export class AnotherAppModule {
}
