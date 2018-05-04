import { ChangeDetectorRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';


describe('AsyncPipe -', () => {

	describe('template use -', () => {

		const givenItems = ['Lebron James', 'Kobe Bryant', 'Vince Carter'];

		@Component({
			selector: 'test',
			template: `
			
				<!-- Async pipe use -->
				<ul id="async-pipe" >
					<li *ngFor="let item of items$ | async" >{{item}}</li>
				</ul>

				<!-- subscribe method use -->
				<ul id="not-async-pipe" >
					<li *ngFor="let item of items" >{{item}}</li>
				</ul>
			
			`
		})
		class TestComponent {

			sub$ = new Subject<any>();

			items$: Observable<Array<string>> = this.sub$.asObservable();

			items: Array<string>;

			constructor(changeDetectorRef: ChangeDetectorRef) {
				this.items$.subscribe((items: Array<string>) => {
					this.items = items;
					changeDetectorRef.detectChanges();
				});
			}

			changeItems(): void {
				this.sub$.next(givenItems);
			}
		}

		beforeEach(() => {
			TestBed
				.configureTestingModule({
					imports: [
						CommonModule
					],
					declarations: [
						TestComponent
					]
				})
		});

		it ('should update variable in template', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.componentInstance.changeItems();
			fixture.detectChanges(); // <--- run change detection

			// then
			const asyncElements = fixture.nativeElement.querySelectorAll('#async-pipe > li'),
				notAsyncElements = fixture.nativeElement.querySelectorAll('#not-async-pipe > li');

			// async pipe
			expect(asyncElements.length).toEqual(givenItems.length);
			expect(asyncElements[0].textContent).toEqual(givenItems[0]);
			expect(asyncElements[1].textContent).toEqual(givenItems[1]);
			expect(asyncElements[2].textContent).toEqual(givenItems[2]);

			// subscribe method
			expect(notAsyncElements.length).toEqual(givenItems.length);
			expect(notAsyncElements[0].textContent).toEqual(givenItems[0]);
			expect(notAsyncElements[1].textContent).toEqual(givenItems[1]);
			expect(notAsyncElements[2].textContent).toEqual(givenItems[2]);
		});


		/**
		 * Async pipe uses markForCheck method to run change detection mechanism.
		 * So unless someone else triggers tick of change detection, it will
		 * not re-render the view.
		 */
		it ('should not update("re-render") the view after change of items', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.componentInstance.changeItems();
			// fixture.detechtChanges(); <--- no detectChanges after items change

			// then
			const elements = fixture.nativeElement.querySelectorAll('#async-pipe > li');

			expect(elements.length).toEqual(0);
		});

		/**
		 * Subscribe method correctly updates the view.
		 */
		it ('should update view for subscribe method', () => {

			// given
			const fixture = TestBed.createComponent(TestComponent);

			// when
			fixture.detectChanges();
			fixture.componentInstance.changeItems();
			// fixture.detechtChanges(); <--- no detectChanges after items change

			// then
			const notAsyncElements = fixture.nativeElement.querySelectorAll('#not-async-pipe > li');
			expect(notAsyncElements.length).toEqual(givenItems.length);
			expect(notAsyncElements[0].textContent).toEqual(givenItems[0]);
			expect(notAsyncElements[1].textContent).toEqual(givenItems[1]);
			expect(notAsyncElements[2].textContent).toEqual(givenItems[2]);
		});

	});

});
