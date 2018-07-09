import { Routes } from '@angular/router';

import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'project', pathMatch: 'full' },
	{ path: 'project', component: ProjectComponent },
	{ path: 'task', component: TaskComponent },
];
