// 3d party imports
import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';

import { Logger } from './util/logger';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.ngx.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

    input = 0;

    private prefix: string = '🐯 Root Level';

    changeInput(): void {
        this.input++;
    }

    renderInput(): string {
        Logger.log(`${this.prefix} - render input`);
        return `${this.input}`;
    }
}
