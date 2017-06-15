import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class ModalService {

    constructor() {} 
    
    // show the filter modal in the app.component
    private _showFilterModal: Subject<boolean> = new Subject<boolean>();
    public set showModal(something:any){
        this._showFilterModal.next(something);
    }
    //show the filter modal in the mainview
    public get showModal():any{
        return this._showFilterModal.asObservable();
    }


}
