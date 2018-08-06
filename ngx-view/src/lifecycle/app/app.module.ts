// 3d party imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// app imports
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LevelOneComponent } from './components/level-one.component';
import { LevelTwoComponent } from './components/level-two.component';
import { SeparatorComponent } from './components/separator.component';
import { LevelThreeComponent } from './components/level-three.component';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { Logger } from './util/logger';
import { GithubApiService } from './http/github-api.service';


@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(routes),

		TaskModule,
		ProjectModule
	],
	declarations: [
		AppComponent,
		LevelOneComponent,
		LevelTwoComponent,
		LevelThreeComponent,
		SeparatorComponent,
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

