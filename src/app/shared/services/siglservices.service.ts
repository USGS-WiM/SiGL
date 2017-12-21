import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Subject } from "rxjs/Subject";

import { CONFIG } from "./config";

import { Iparameter } from "../../shared/interfaces/parameter.interface";
import { IprojDuration } from "../../shared/interfaces/projduration.interface";
import { IprojStatus } from "../../shared/interfaces/projstatus.interface";
import { Iresource } from "../../shared/interfaces/resource.interface";
import { Imedia } from "../../shared/interfaces/media.interface";
import { Ilake } from "../../shared/interfaces/lake.interface";
import { Istate } from "../../shared/interfaces/state.interface";
import { ImonitorEffort } from "../../shared/interfaces/monitoreffort.interface";
import { Iproject } from "../../shared/interfaces/project.interface";
import { Iorganization } from "../../shared/interfaces/organization.interface";
import { Iobjective } from "../../shared/interfaces/objective.interface";
import { IchosenFilters } from "../../shared/interfaces/chosenFilters.interface";
import { Isite } from "../../shared/interfaces/site.interface";
import { Ifilteredproject } from "../../shared/interfaces/filteredproject";
import { Ifullproject } from "../../shared/interfaces/fullproject.interface";
import { Ifullsite } from "../../shared/interfaces/fullsite.interface";

import { MapService } from '../../shared/services/map.service';

@Injectable()
export class SiglService {
	private filteredSiteIDArray: any;
	private filteredSiteSubscription: any;

	constructor(private _http: Http, private _mapService: MapService) {
		this.setParameters();
		this.setProjDurations();
		this.setProjStatuses();
		this.setResources();
		this.setMedia();
		this.setLakes();
		this.setStates();
		this.setMonitorEfforts();
		this.setProjects();
		this.setOrganizations();
		this.setObjectives();
		// this gets updated everytime a filter is done. the mapServices filters the geojson and stores the filtered
		// siteIDs in array for sidebar to use for styling the list of sites within each project (and for counts)
		this._mapService.filteredSiteIDs.subscribe((siteIds: any) => {
			this.filteredSiteIDArray = siteIds;
		});
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
	private _chosenFilterSubject: Subject<any> = new Subject<any>();
	private _filteredProjectSubject: Subject<Array<Ifilteredproject>> = new Subject<Array<Ifilteredproject>>();
	private _fullProjectSubject: Subject<Ifullproject> = new Subject<Ifullproject>();
	private _singleSiteSubject: Subject<Ifullsite> = new Subject<Ifullsite>();
	private _sitePointClick: Subject<boolean> = new Subject<boolean>();

	
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
	public get chosenFilters(): any {
		return this._chosenFilterSubject.asObservable();
	}
	/*public get filteredSites(): Observable<Array<Isite>>{
		return this._filteredSitesSubject.asObservable();
	}*/
	//returns filtered projects from setFilteredSites()'s call to /FilteredProjects?...params...
	public get filteredProjects(): Observable<Array<Ifilteredproject>>{
		return this._filteredProjectSubject.asObservable();
	}
	public get fullProject(): Observable<Ifullproject>{
		return this._fullProjectSubject.asObservable();
	}	
	public get fullSite(): Observable<Ifullsite>{
		return this._singleSiteSubject.asObservable();
	}
	public get sitePointClickBool(): Observable<boolean>{
		return this._sitePointClick.asObservable();
	}
	//http requests  
	//get from services, set subjects
	//called from constructor only so private
	private setParameters(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PARAMETERS_URL, options)
			.map(res => <Array<Iparameter>>res.json())
			.subscribe(p => {
				this._parameterSubject.next(p);
			}, error => this.handleError);
	}
	private setProjDurations(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJ_DURATIONS_URL, options)
			.map(res => <Array<IprojDuration>>res.json())
			.subscribe(pd => {
				this._projDurationSubject.next(pd);
			}, error => this.handleError);
	}
	private setProjStatuses(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJ_STATUS_URL, options)
			.map(res => <Array<IprojStatus>>res.json())
			.subscribe(ps => {
				this._projStatusSubject.next(ps);
			}, error => this.handleError);
	}
	private setResources(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.RESOURCES_URL, options)
			.map(res => <Array<Iresource>>res.json())
			.subscribe(r => {
				this._resourceSubject.next(r);
			}, error => this.handleError);
	}
	private setMedia(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.MEDIA_URL, options)
			.map(res => <Array<Imedia>>res.json())
			.subscribe(m => {
				this._mediaSubject.next(m);
			}, error => this.handleError);
	}
	private setLakes(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.LAKES_URL, options)
			.map(res => <Array<Ilake>>res.json())
			.subscribe(l => {
				this._lakeSubject.next(l);
			}, error => this.handleError);
	}
	private setStates(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.STATES_URL, options)
			.map(res => <Array<Istate>>res.json())
			.subscribe(s => {
				this._stateSubject.next(s);
			}, error => this.handleError);
	}
	private setMonitorEfforts(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.MONITOR_EFFORTS_URL, options)
			.map(res => <Array<ImonitorEffort>>res.json())
			.subscribe(me => {
				this._monitorEffortSubject.next(me);
			}, error => this.handleError);
	}
	private setProjects(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJECT_URL, options)
			.map(res => <Array<Iproject>>res.json())
			.subscribe(pr => {
				this._projectSubject.next(pr);
			}, error => this.handleError);
	}
	private setOrganizations(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.ORGANIZATION_URL, options)
			.map(res => <Array<Iorganization>>res.json())
			.subscribe(o => {
				this._organizationSubject.next(o);
			}, error => this.handleError);
	}
	private setObjectives(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.OBJECTIVE_URL, options)
			.map(res => <Array<Iobjective>>res.json())
			.subscribe(ob => {
				this._objectiveSubject.next(ob);
			}, error => this.handleError);
	}
	//called when filters modal closes and passes chosen filters
	public setFilteredSites(filters: IchosenFilters): void {
		this.chosenFilters = filters;
		if (Object.keys(filters).length > 0) {
			//filter it
			let sitesParam: URLSearchParams = new URLSearchParams();
			if (filters.p_organization) sitesParam.set("ProjOrg", filters.p_organization.toString());
			if (filters.p_objectives) sitesParam.set("ProjObjs", filters.p_objectives.join(','));
			if(filters.s_parameters) sitesParam.set("Parameters", filters.s_parameters.join(","));
			if (filters.s_projDuration) sitesParam.set("Duration", filters.s_projDuration.join(","));
			if (filters.s_projStatus) sitesParam.set("Status", filters.s_projStatus.join(","));
			if (filters.s_resources) sitesParam.set("ResComp", filters.s_resources.join(","));
			if (filters.s_media) sitesParam.set("Media", filters.s_media.join(","));
			if (filters.s_lakes) sitesParam.set("Lake", filters.s_lakes.join(","));
			if (filters.s_states) sitesParam.set("State", filters.s_states.join(","));
			if (filters.s_monitorEffect) sitesParam.set("ProjMonitorCoords", filters.s_monitorEffect.join(","));
			
			if (sitesParam.paramsMap.size > 0) {
				if (this.filteredSiteSubscription) this.filteredSiteSubscription.unsubscribe();
				//hit the filtered projects url
				let options = new RequestOptions( { headers: CONFIG.MIN_JSON_HEADERS, search: sitesParam });
				this.filteredSiteSubscription = this._http.get(CONFIG.FILTERED_PROJECTS_URL, options)
				.map(res => <Array<Ifilteredproject>>res.json())
				.subscribe(proj => {
					//HERE is where to add the loop to find all the site_ids from filtered sites to these sites to add 'filtered' prop = true
					for (let p of proj) {
						for (let s of p.projectSites) {
							if (this.filteredSiteIDArray.includes(s.site_id))
							{
								s.isDisplayed = true;
							} else {
								s.isTempDisplayed = false; //set rest to hold isTempDisplayed property
							}						
						}
					}
					this._filteredProjectSubject.next(proj);
				}, error => this.handleError);
			} else {
				if (filters.ProjectName) {
					// project name search
					this.setFullProject(filters.ProjectName.project_id.toString());
				} else {
					this._filteredProjectSubject.next([]);
				}
			}
			
		} else {
			//clear it all
			this._filteredProjectSubject.next([]);
		}
	}

	//  /GetFullProject?ByProject=
	public setFullProject(projectId: string){		
		let projectParams: URLSearchParams = new URLSearchParams();
		projectParams.set("ByProject", projectId);
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS, search:projectParams});
		this._http.get(CONFIG.FULL_PROJECT_URL, options)
			.map(res => <Ifullproject>res.json())
			.subscribe(fullProj => {
				this._fullProjectSubject.next(fullProj);
			}, error => this.handleError);
	}
	
	// /GetFullSite
	public setFullSite(siteId: string){
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.SITE_URL + "/" + siteId + "/GetFullSite", options)
			.map(res => <Ifullsite>res.json())
			.subscribe(fs => {
				this._singleSiteSubject.next(fs);
			}, error => this.handleError);
	}

	//set filters selected by user in the filter modal (filter.component.ts)
	public set chosenFilters(filters: any) {
		this._chosenFilterSubject.next(filters);
	} 

	public setsitePointClickBool(val: boolean) {
		this._sitePointClick.next(val);
	} 
	
	//Error Handler
	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || "Server Error");
	}
}
