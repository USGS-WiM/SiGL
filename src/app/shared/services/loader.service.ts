import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService {
    private _loaderSubject = new Subject<boolean>();   
    //private _sideloaderSubject = new Subject<boolean>();     
    private _sideloaderSubject = new BehaviorSubject<boolean>(false);   
    public loaderState = this._loaderSubject.asObservable();
    public sideloaderState = this._sideloaderSubject.asObservable();
    
    constructor() { }
    
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