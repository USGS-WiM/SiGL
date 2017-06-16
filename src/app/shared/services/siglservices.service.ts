import { Injectable } from '@angular/core';
import { Http,  Response, RequestOptions } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Iparameter } from "app/shared/interfaces/parameter.interface";
import { IprojDuration } from "app/shared/interfaces/projduration.interface";
import { IprojStatus } from "app/shared/interfaces/projstatus.interface";
import { Iresource } from "app/shared/interfaces/resource.interface";
import { Imedia } from "app/shared/interfaces/media.interface";

import { Observable } from "rxjs/Observable";
import { CONFIG } from "./config";

import "rxjs/add/operator/map";
import { Ilake } from "app/shared/interfaces/lake.interface";
import { Istate } from "app/shared/interfaces/state.interface";
import { ImonitorEffort } from "app/shared/interfaces/monitoreffort.interface";
import { Iproject } from "app/shared/interfaces/project.interface";
import { Iorganization } from "app/shared/interfaces/organization.interface";
import { Iobjective } from "app/shared/interfaces/objective.interface";




@Injectable()
export class SiglService {

  constructor(private _http: Http) {
        this.getParameters();
        this.getProjDurations();
        this.getProjStatuses();
        this.getResources();
        this.getMedia();
        this.getLakes();
        this.getStates();
        this.getMonitorEfforts();
        this.getProjects();
        this.getOrganizations();
        this.getObjectives();
    }

    // subjects
    private _parameterSubject: Subject<Array<Iparameter>> = new Subject<Array<Iparameter>>();
    private _projDurationSubject: Subject<Array<IprojDuration>> = new Subject<Array<IprojDuration>>();
    private _projStatusSubject: Subject<Array<IprojStatus>> = new Subject<Array<IprojStatus>>();
    private _resourceSubject: Subject<Array<Iresource>> = new Subject<Array<Iresource>>();
    private _mediaSubject: Subject<Array<Imedia>> = new Subject<Array<Imedia>>();
    private _lakeSubject: Subject<Array<Ilake>> = new Subject<Array<Ilake>>();
    private _stateSubject: Subject<Array<Istate>> = new Subject<Array<Istate>>();
    private _monitorEffortSubject: Subject<Array<ImonitorEffort>> = new Subject<Array<ImonitorEffort>>();
    private _projectSubject: Subject<Array<Iproject>> = new Subject<Array<Iproject>>();
    private _organizationSubject: Subject<Array<Iorganization>> = new Subject<Array<Iorganization>>();
    private _objectiveSubject: Subject<Array<Iobjective>> = new Subject<Array<Iobjective>>();
    
    //getters
    public get parameters(): Observable<Array<Iparameter>> {
      return this._parameterSubject.asObservable();
    }
    public get projDurations(): Observable<Array<IprojDuration>> {
      return this._projDurationSubject.asObservable();
    }
    public get projStatuses(): Observable<Array<IprojStatus>> {
      return this._projStatusSubject.asObservable();
    }
    public get resources(): Observable<Array<Iresource>> {
      return this._resourceSubject.asObservable();
    }
    public get media(): Observable<Array<Imedia>> {
      return this._mediaSubject.asObservable();
    }
    public get lakes(): Observable<Array<Ilake>> {
      return this._lakeSubject.asObservable();
    }
    public get state(): Observable<Array<Istate>> {
      return this._stateSubject.asObservable();
    }
    public get monitorEffort(): Observable<Array<ImonitorEffort>> {
      return this._monitorEffortSubject.asObservable();
    }
    public get project(): Observable<Array<Iproject>> {
      return this._projectSubject.asObservable();
    }
    public get organization(): Observable<Array<Iorganization>> {
      return this._organizationSubject.asObservable();
    }
    public get objective(): Observable<Array<Iobjective>> {
      return this._objectiveSubject.asObservable();
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
    private getProjDurations(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.PROJ_DURATIONS_URL, options)
        .map(res => <Array<IprojDuration>>res.json())
        .subscribe(pd => {
            this._projDurationSubject.next(pd);
        }, error => this.handleError);
    }
    private getProjStatuses(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.PROJ_STATUS_URL, options)
        .map(res => <Array<IprojStatus>>res.json())
        .subscribe(ps => {
          this._projStatusSubject.next(ps);
        }, error => this.handleError);
    }
    private getResources(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.RESOURCES_URL, options)
        .map(res => <Array<Iresource>>res.json())
        .subscribe(r => {
          this._resourceSubject.next(r);
        }, error => this.handleError);
    }
    private getMedia(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.MEDIA_URL, options)
        .map(res => <Array<Imedia>>res.json())
        .subscribe(m => {
          this._mediaSubject.next(m);
        }, error => this.handleError);
    }
    private getLakes(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.LAKES_URL, options)
        .map(res => <Array<Ilake>>res.json())
        .subscribe(l => {
          this._lakeSubject.next(l);
        }, error => this.handleError);
    }
    private getStates(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.STATES_URL, options)
        .map(res => <Array<Istate>>res.json())
        .subscribe(s => {
          this._stateSubject.next(s);
        }, error => this.handleError);
    }
    private getMonitorEfforts(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.MONITOR_EFFORTS_URL, options)
        .map(res => <Array<ImonitorEffort>>res.json())
        .subscribe(me => {
          this._monitorEffortSubject.next(me);
        }, error => this.handleError);
    }
    private getProjects(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.PROJECT_URL, options)
        .map(res => <Array<Iproject>>res.json())
        .subscribe(pr => {
          this._projectSubject.next(pr);
        }, error => this.handleError);
    }
    private getOrganizations(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.ORGANIZATION_URL, options)
        .map(res => <Array<Iorganization>>res.json())
        .subscribe(o => {
          this._organizationSubject.next(o);
        }, error => this.handleError);
    }
    private getObjectives(): void {
      let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
      this._http.get(CONFIG.OBJECTIVE_URL, options)
        .map(res => <Array<Iobjective>>res.json())
        .subscribe(ob => {
          this._objectiveSubject.next(ob);
        }, error => this.handleError);
    }


    

    //Error Handler
    private handleError(error: Response){
      console.error(error);
      return Observable.throw(error.json().error || "Server Error");
    }
}
