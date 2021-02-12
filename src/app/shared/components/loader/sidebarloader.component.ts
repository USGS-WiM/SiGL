// ------------------------------------------------------------------------------
// ------------ sidebarloader.component -----------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     selector component that sits within the sidebar.component.html page.
//              Is a loading div that covers the Project List section between each filter change until the new Project List is shown

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { LoaderService } from "../../services/loader.service";

@Component({
    selector: "sideloader-div",
    template: `<div [class.sideloader-hidden]="!show">
        <div class="side-loader" id="side-loader"></div>
    </div>`,
    styleUrls: ["loader.component.css"],
})
export class SideLoaderComponent implements OnInit {
    public show = false;
    private subscription: Subscription;

    constructor(private _loaderService: LoaderService) {}

    ngOnInit() {
        // subscription to update the class on the div to show/hide the div
        this.subscription = this._loaderService.sideloaderState.subscribe(
            (state: boolean) => {
                this.show = state;
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
