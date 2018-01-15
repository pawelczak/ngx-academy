import { Component } from '@angular/core';


@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.ngx.scss'
	]
})
export class AppComponent {

	heroes = ['Hulk', 'Thor', 'Spiderman'];
}
