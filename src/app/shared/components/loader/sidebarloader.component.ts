import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'sideloader-div',
    template: `<div [class.sideloader-hidden]="!show">
                  <div class="side-loader" id="side-loader"></div>
                </div>`,
    styleUrls: ['loader.component.css']
})

export class SideLoaderComponent implements OnInit {
    public show = false; 
    private subscription: Subscription;

    constructor(private _loaderService: LoaderService) { }

    ngOnInit() {         
        this.subscription = this._loaderService.sideloaderState.subscribe((state: boolean) => {
            this.show = state;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}