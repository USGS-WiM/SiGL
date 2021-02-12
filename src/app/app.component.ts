// ------------------------------------------------------------------------------
// ------------ app.component ---------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The main starting point. The app.component contains the @ViewChild components for navbar, sidebar, and mainview

import { Component, ViewChild } from "@angular/core";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { MapviewComponent } from "./mainview/map/mapview.component";
import { SiglService } from "./shared/services/siglservices.service";
import { environment } from "environments/environment";

@Component({
    selector: "app-root",
    template: `
        <loader-div></loader-div>
        <navbar></navbar>
        <sidebar></sidebar>
        <mapview></mapview>
    `,
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    constructor(private _siglService: SiglService) {
        this._siglService.setVersion(environment.version);
    }
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild(SidebarComponent) sidebarComponent: SidebarComponent;
    @ViewChild(MapviewComponent) mapviewComponent: MapviewComponent;
}
