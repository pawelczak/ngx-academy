export abstract class LifeCyclesComponent {

	abstract log(text: any): void;

	ngOnChanges() {
		this.log('ngOnChanges');
	}

	ngOnInit() {
		this.log('ngOnInit');
	}

	ngDoCheck() {
		this.log('ngDoCheck');
	}

	ngAfterContentInit() {
		this.log('ngAfterContentInit');
	}

	ngAfterContentChecked() {
		this.log('ngAfterContentChecked');
	}

	ngAfterViewInit() {
		this.log('ngAfterViewInit');
	}

	ngAfterViewChecked() {
		this.log('ngAfterViewChecked');
	}

	ngOnDestroy() {
		this.log('ngOnDestroy');
	}

}
