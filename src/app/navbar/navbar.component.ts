// ------------------------------------------------------------------------------
// ------------ navbar.component ------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The navbar component is along the top of the application and contains the About and User Guide buttons

import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalService } from "../shared/services/modal.service";
import { SiglService } from "app/shared/services/siglservices.service";

@Component({
    selector: "navbar",
    template: `<div id="navbar">
        <div id="headerLogo">
            <div id="usgsLogoDiv">
                <i
                    class="fa fa-bars"
                    id="mobileMenuBtn"
                    (click)="mobileMenuBtnClick()"
                ></i>
                <img
                    id="usgsLogo"
                    alt="USGS Logo"
                    title="USGS Links"
                    src="assets/usgsLogo.png"
                /><!--</a>-->
            </div>
            <div id="titles">
                <div class="appname">Science in the Great Lakes (SiGL)</div>
            </div>
        </div>
        <button
            type="button"
            class="aboutNav pull-right"
            (click)="showAboutModal()"
        >
            <i class="fa fa-info-circle"></i>&nbsp;&nbsp;About
        </button>
        <button
            type="button"
            class="aboutNav pull-right"
            (click)="showUserGuideModal()"
        >
            <i class="fa fa-book"></i>&nbsp;&nbsp;UserGuide
        </button>
    </div>`,
    styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
    public title: string;
    public subtitle: string;
    private mobileMenuToggle: boolean;

    constructor(
        private _modalService: ModalService,
        private _siglService: SiglService
    ) {}

    ngOnInit() {
        this.title = "SiGL";
        this.subtitle = "Science in the Great Lakes";
        this.mobileMenuToggle = false;
    }

    public mobileMenuBtnClick() {
        this.mobileMenuToggle = !this.mobileMenuToggle;

        if (this.mobileMenuToggle) this._siglService.showTheSidebar();
        else this._siglService.hideTheSidebar();
    }

    public showAboutModal() {
        this._modalService.showAboutModal = true;
    }

    public showUserGuideModal() {
        this._modalService.showUserGuideModal = true;
    }
}
