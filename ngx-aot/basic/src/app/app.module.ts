// 3d party imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// app imports
import { AppComponent } from './app.component';


@NgModule({
	imports: [
		BrowserModule
	],
	declarations: [
		AppComponent
	],
	providers: [
	],
	entryComponents: [
		AppComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
}

