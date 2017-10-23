import { TestBed } from '@angular/core/testing';

import { LevelOneComponent } from '../../src/app/components/level-one.component';
import { Logger } from '../../src/app/util/logger';


describe('View test', () => {


	describe('Life cycle hooks - One level of component', () => {


		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [],
					declarations: [
						LevelOneComponent
					],
					providers: [{
						provide: Logger, useValue: {log: () => {}}
					}]
				});
		});

		it ('it should invoke lifecycle hooks', () => {

			// given
			const expectedCycles = [
				// 'ngOnChanges',
				'ngOnInit',
				'ngDoCheck',
				'ngAfterContentInit',
				'ngAfterContentChecked',
				'ngAfterViewInit',
				'ngAfterViewChecked',
				'ngOnDestroy'
			];
			let cycles: Array<string> = [];

			class MockLogger {
				log (text: string): void {
					cycles.push(text);
				}
			}

			let mockLogger = new MockLogger();

			TestBed.overrideProvider(Logger, {useValue: mockLogger});
			TestBed.overrideTemplate(LevelOneComponent, `<p>Level one Component</p>`);

			const fixture = TestBed.createComponent(LevelOneComponent),
				element = fixture.nativeElement;

			fixture.componentInstance.prefix = '';

			// when
			fixture.detectChanges();
			fixture.destroy();

			// then
			expect(cycles).toEqual(expectedCycles);

		});



	});


});