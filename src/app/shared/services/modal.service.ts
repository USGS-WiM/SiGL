// ------------------------------------------------------------------------------
// ------------ modal.service ---------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Service for the the modals (filters, about, user guide)

import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class ModalService {

    constructor() {} 

    // filter modal in the app.component
    private _showFilterModal: Subject<boolean> = new Subject<boolean>();
    public set showFilterModal(something:any){
        this._showFilterModal.next(something);
    }    
    public get showFilterModal():any{
        return this._showFilterModal.asObservable();
    }

    // filters chosen from modal, tell sidebar to show the ones chosen    
    private _chosenFilters: Subject<any> = new Subject<any>();
    public set chosenFilters(something:any){
        this._chosenFilters.next(something);
    }
    public get chosenFilters():any{
        return this._chosenFilters.asObservable();
    }

    // show the about modal in the app.component
    private _showAboutModal: Subject<boolean> = new Subject<boolean>();
    public set showAboutModal(something:any){
        this._showAboutModal.next(something);
    }
    //show the about modal in the mainview
    public get showAboutModal():any{
        return this._showAboutModal.asObservable();
    }

    // show the userguide modal in the app.component
    private _showUserGuideModal: Subject<boolean> = new Subject<boolean>();
    public set showUserGuideModal(something:any){
        this._showUserGuideModal.next(something);
    }
    //show the about modal in the mainview
    public get showUserGuideModal():any{
        return this._showUserGuideModal.asObservable();
    }
}
