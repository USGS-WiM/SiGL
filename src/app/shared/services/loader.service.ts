import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface LoaderState {
    show: boolean;
};

@Injectable()
export class LoaderService {
    private _loaderSubject = new Subject<LoaderState>();    
    public loaderState = this._loaderSubject.asObservable();
    
    constructor() { }
    
    show() {
        this._loaderSubject.next(<LoaderState>{show: true});
    }
    hide() {
        this._loaderSubject.next(<LoaderState>{show: false});
    }
}