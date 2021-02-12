// ------------------------------------------------------------------------------
// ------------ loader.service --------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Service for updating boolean subjects that are subscribed to for show/hiding the loading div

import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class LoaderService {
    private _loaderSubject = new Subject<boolean>();
    private _sideloaderSubject = new BehaviorSubject<boolean>(false);

    public loaderState = this._loaderSubject.asObservable();
    public sideloaderState = this._sideloaderSubject.asObservable();

    constructor() {}

    // whole page initial load
    public showFullPageLoad() {
        this._loaderSubject.next(true);
    }
    public hideFullPageLoad() {
        this._loaderSubject.next(false);
    }

    // sidebar load between filter updates
    public showSidebarLoad() {
        this._sideloaderSubject.next(true);
    }
    public hideSidebarLoad() {
        this._sideloaderSubject.next(false);
    }
}
