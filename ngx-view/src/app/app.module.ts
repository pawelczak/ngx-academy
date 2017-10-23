// 3d party imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// app imports
import { AppComponent } from './app.component';
import { LevelOneComponent } from './components/level-one.component';
import { LevelTwoComponent } from './components/level-two.component';
import { SeparatorComponent } from './components/separator.component';
import { LevelThreeComponent } from './components/level-three.component';
import { Logger } from './util/logger';


@NgModule({
	imports: [
		BrowserModule
	],
	declarations: [
		AppComponent,
		LevelOneComponent,
		LevelTwoComponent,
		LevelThreeComponent,
		SeparatorComponent
	],
	providers: [
		Logger
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

