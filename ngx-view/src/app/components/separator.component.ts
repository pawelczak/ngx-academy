import { Component } from '@angular/core';

import { Logger } from '../util/logger';

@Component({
    selector: 'ct-separator',
    template: `
    
    {{renderTemplate()}}
    `
})
export class SeparatorComponent {


    log(text: string): void {
        Logger.log(text);
    }

    renderTemplate(): void {
        this.log('🐋 separator - render input');
    }
}