// ------------------------------------------------------------------------------
// ------------ highlight.directive ---------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Directive used in the sidebar Project List that is activated on mouseenter and mouseleave of the element with the selector
//              Adds gray temporary highlight as user mouses over site names under the Project name.

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective {
    constructor(private _el: ElementRef) { }

    // on mouseenter, set backgroundColor to gray
    @HostListener('mouseenter') onMouseEnter() {
        this.highlight('#eaeaea');
    }    

    // on mouseleave, set backgroundColor to null
    @HostListener('mouseleave') onMouseLeave() {    
        this.highlight(null);
    }

    private highlight(color: string) {
        this._el.nativeElement.style.backgroundColor = color;
    }
}