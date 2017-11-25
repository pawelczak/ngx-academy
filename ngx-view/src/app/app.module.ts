// 3d party imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// app imports
import { AppComponent } from './app.component';
import { LevelOneComponent } from './components/level-one.component';
import { LevelTwoComponent } from './components/level-two.component';
import { SeparatorComponent } from './components/separator.component';
import { LevelThreeComponent } from './components/level-three.component';
import { Logger } from './util/logger';
import { GithubApiService } from './http/github-api.service';


@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule
	],
	declarations: [
		AppComponent,
		LevelOneComponent,
		LevelTwoComponent,
		LevelThreeComponent,
		SeparatorComponent
	],
	providers: [
		Logger,
		GithubApiService
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

