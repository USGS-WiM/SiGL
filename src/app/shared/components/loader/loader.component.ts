import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, LoaderState } from '../../services/loader.service';

@Component({
    selector: 'loader-div',
    template: `<div [class.loader-hidden]="!show">
                  <div class="page-loader" id="page-loader"></div>
                </div>`,
    styleUrls: ['loader.component.css']
})

export class LoaderComponent implements OnInit {
    public show = true; //start it showing until the geojson comes back
    private subscription: Subscription;

    constructor(private _loaderService: LoaderService) { }

    ngOnInit() { 
        this.subscription = this._loaderService.loaderState.subscribe((state: LoaderState) => {
            this.show = state.show;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}