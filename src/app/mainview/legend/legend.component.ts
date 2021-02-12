// ------------------------------------------------------------------------------
// ------------ legend.component ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The legend component is a selector component that contains the legend that sits in the upper right corner.

import { Component, OnInit } from "@angular/core";

@Component({
    selector: "sigllegend",
    templateUrl: "./legend.component.html",
    styleUrls: ["./legend.component.css"],
})
export class SiglLegendComponent implements OnInit {
    public controlCollapsed: boolean;

    ngOnInit() {
        this.controlCollapsed = true;
    }
}
