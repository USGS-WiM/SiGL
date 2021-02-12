// ------------------------------------------------------------------------------
// ------------ navbar.module ---------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The Module for the navbar, which has the User Guide and About buttons

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar.component";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [NavbarComponent],
    exports: [NavbarComponent],
})
export class NavbarModule {}
