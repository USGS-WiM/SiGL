import { Injectable } from '@angular/core';
import { Http,  Response, RequestOptions } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Iparameter } from "app/shared/interfaces/parameter.interface";
import { Observable } from "rxjs/Observable";
import { CONFIG } from "./config";

import "rxjs/add/operator/map";

@Injectable()
export class SiglService {

  constructor(private _http: Http) {
        this.getParameters();
/*        this.getProjDurations();
        this.getProjStatuses();
        this.getResources();
        this.getMedia();
        this.getLakes();
        this.getStates();
        this.getMonitorEfforts();
        this.getProjects();
        this.getOrganizations();
        this.getObjectives();*/
    }

    // subjects
    private _parameterSubject: Subject<Array<Iparameter>> = new Subject<Array<Iparameter>>();
    
    //getters
    public get parameters(): Observable<Array<Iparameter>> {
      return this._parameterSubject.asObservable();
    }

    //http requests
    private getParameters(): void {
      let options = new RequestOptions({headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.PARAMETERS_URL, options)
        .map(res => <Array<Iparameter>>res.json())
        .subscribe(p => {
            this._parameterSubject.next(p);
        }, error => this.handleError);
      
    }

    private handleError(error: Response){
      console.error(error);
      return Observable.throw(error.json().error || "Server Error");
    }
}
