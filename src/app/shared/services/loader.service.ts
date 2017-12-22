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
    
    public show() {
        this._loaderSubject.next(<LoaderState>{show: true});
    }
    public hide() {
        this._loaderSubject.next(<LoaderState>{show: false});
    }
}