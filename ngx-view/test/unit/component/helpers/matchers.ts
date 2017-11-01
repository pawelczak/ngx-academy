import { ViewContainerRef } from '@angular/core';


/**
 * Checks if argument is of ViewContainerRef type
 *
 * @param vcr
 * @returns {boolean}
 */
export function isViewContainerRef(vcr: ViewContainerRef): boolean {

	if (vcr.element &&
		vcr.injector &&
		vcr.parentInjector &&
		vcr.createEmbeddedView) {
		return true;
	}

	return false;
}
