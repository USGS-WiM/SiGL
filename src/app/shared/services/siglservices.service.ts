// ------------------------------------------------------------------------------
// ------------ siglservices.service --------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Service for the whole application. setters/getters needed to communicate information with the mapview.component, sidebar.component, and filter.component

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";

import { BehaviorSubject } from 'rxjs';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { CONFIG } from "./config";
import { MapService } from '../../shared/services/map.service';
import { LoaderService } from '../../shared/services/loader.service';
//import { FilterComponent } from '../../shared/components/filter/filter.component'; //testing

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
import { EventEmitter } from 'selenium-webdriver';

@Injectable()
export class SiglService {
	private filteredSiteIDArray: any;
    private filteredSiteSubscription: any;
    
    //TODO: Event Emitter to catch changes and report to FilterComponent?
    //serviceUpdated: EventEmitter = new EventEmitter();

	constructor(private _http: Http, private _mapService: MapService, private _loaderService: LoaderService) {
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
		this.setSites(); //needed for the About modal
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
	// on init of app (and when filters are all cleared, show this list of all projects in the sidebar Project List)
	private _allProjectsSubject: Subject<Array<Ifilteredproject>> = new Subject<Array<Ifilteredproject>>(); 
	private _projectSubject: Subject<Array<Iproject>> = new Subject<Array<Iproject>>();
	private _siteSubject: Subject<Array<Isite>> = new Subject<Array<Isite>>();
	private _organizationSubject: Subject<Array<Iorganization>> = new Subject<Array<Iorganization>>();
	private _objectiveSubject: Subject<Array<Iobjective>> = new Subject<Array<Iobjective>>();
	private _chosenFilterSubject: Subject<any> = new Subject<any>();
	private _filteredProjectSubject: Subject<Array<Ifilteredproject>> = new Subject<Array<Ifilteredproject>>();
	private _fullProjectSubject: Subject<Ifullproject> = new Subject<Ifullproject>();
	private _singleSiteSubject: Subject<Ifullsite> = new Subject<Ifullsite>();
    private _sitePointClick: Subject<boolean> = new Subject<boolean>();
    
    private _clearAllFilters: BehaviorSubject<boolean> = <BehaviorSubject<boolean>> new BehaviorSubject(false);
    public setClearAllFilters(wasClicked: boolean): void {
        this._clearAllFilters.next(wasClicked);
    }
    public get clearAllFilters(): Observable<boolean>{
        return this._clearAllFilters.asObservable();
    }
	
    // getters
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
	public get allProjects(): Observable<Array<Ifilteredproject>>{
		return this._allProjectsSubject.asObservable();
	}
	public get sites(): Observable<Array<Isite>> {
		return this._siteSubject.asObservable();
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
	// returns filtered projects from setFilteredSites()'s call to /FilteredProjects?...params...
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
	// http requests  
	// get from services, set subjects
	// called from constructor only so private
	private setParameters(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PARAMETERS_URL, options)
			.map(res => <Array<Iparameter>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(p => {
				this._parameterSubject.next(p);
			});
	}
	private setProjDurations(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJ_DURATIONS_URL, options)
			.map(res => <Array<IprojDuration>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(pd => {
				this._projDurationSubject.next(pd);
			});
	}
	private setProjStatuses(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJ_STATUS_URL, options)
			.map(res => <Array<IprojStatus>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(ps => {
				this._projStatusSubject.next(ps);
			});
	}
	private setResources(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.RESOURCES_URL, options)
			.map(res => <Array<Iresource>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(r => {
				this._resourceSubject.next(r);
			});
	}
	private setMedia(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.MEDIA_URL, options)
			.map(res => <Array<Imedia>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(m => {
				this._mediaSubject.next(m);
			});
	}
	private setLakes(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.LAKES_URL, options)
			.map(res => <Array<Ilake>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(l => {
				this._lakeSubject.next(l);
			});
	}
	private setStates(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.STATES_URL, options)
			.map(res => <Array<Istate>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(s => {
				this._stateSubject.next(s);
			});
	}
	private setMonitorEfforts(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.MONITOR_EFFORTS_URL, options)
			.map(res => <Array<ImonitorEffort>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(me => {
				this._monitorEffortSubject.next(me);
			});
	}
	private setProjects(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.PROJECT_URL, options)
			.map(res => <Array<Iproject>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(pr => {
				this._projectSubject.next(pr);
			});
		this._http.get(CONFIG.FILTERED_PROJECTS_URL, options)
			.map(res => <Array<Ifilteredproject>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(pr => {
				this._allProjectsSubject.next(pr);
			});
	}
	private setOrganizations(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.ORGANIZATION_URL, options)
			.map(res => <Array<Iorganization>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(o => {
				this._organizationSubject.next(o);
			});
	}
	private setObjectives(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.OBJECTIVE_URL, options)
			.map(res => <Array<Iobjective>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(ob => {
				this._objectiveSubject.next(ob);
			});
	}
	// called when passes chosen filters
	public setFilteredSites(filters: IchosenFilters): void {
		this.chosenFilters = filters;
		this._loaderService.showSidebarLoad();
		if (Object.keys(filters).length > 0) {
			// filter it
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
				// hit the filtered projects url
				let options = new RequestOptions( { headers: CONFIG.MIN_JSON_HEADERS, search: sitesParam });
				this.filteredSiteSubscription = this._http.get(CONFIG.FILTERED_PROJECTS_URL, options)
					.map(res => <Array<Ifilteredproject>>res.json())
					.catch((err, caught) => this.handleError(err, caught))
					.subscribe(proj => {
						// HERE is where to add the loop to find all the site_ids from filtered sites to these sites to add 'filtered' prop = true
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
						this._loaderService.hideSidebarLoad();
						this._filteredProjectSubject.next(proj);
					});					
			} else {
				if (filters.ProjectName) {
					// project name search
					this._loaderService.hideSidebarLoad();
					this.setFullProject(filters.ProjectName.project_id.toString());
				} else {
					this._loaderService.hideSidebarLoad();
					this._filteredProjectSubject.next([]);
				}
			}			
		} else {
			// clear it all and show allProjects in sidebar
			this._loaderService.hideSidebarLoad();
            this._filteredProjectSubject.next([]);
			// HERE show all
		}
	}
	// GetFullProject?ByProject=
	public setFullProject(projectId: string){		
		let projectParams: URLSearchParams = new URLSearchParams();
		projectParams.set("ByProject", projectId);
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS, search:projectParams});
		this._http.get(CONFIG.FULL_PROJECT_URL, options)
			.map(res => <Ifullproject>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(fullProj => {
				this._fullProjectSubject.next(fullProj);
			});			
	}	
	// /GetFullSite
	public setFullSite(siteId: string){
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.SITE_URL + "/" + siteId + "/GetFullSite", options)
			.map(res => <Ifullsite>res.json())			
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(fs => {
				this._singleSiteSubject.next(fs);
			});
	}
	//set filters selected by user in the filter modal (filter.component.ts)
	public set chosenFilters(filters: any) {
		this._chosenFilterSubject.next(filters);
	}
	public setsitePointClickBool(val: boolean) {
		this._sitePointClick.next(val);
	}	
	private setSites(): void {
		let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
		this._http.get(CONFIG.SITE_URL, options)
			.map(res => <Array<Isite>>res.json())
			.catch((err, caught) => this.handleError(err, caught))
			.subscribe(s => {
				this._siteSubject.next(s);
			});
	}
	//Error Handler
	private handleError(error: any, caught: any) {
		this._loaderService.hideSidebarLoad();
		let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);		
	}

	// -+-+-+-+-+-+-+-+-+ app version (gotten from environment.ts) -+-+-+-+-+-+-+-+
    private appversion: BehaviorSubject<string> = <BehaviorSubject<string>>new BehaviorSubject("");
    public setVersion(val: string) {
        this.appversion.next(val);
    }
    public get getVersion(): any {
        return this.appversion.asObservable();
	}
	
	// -+-+-+-+-+-+-+-+-+ mobile responsive sidebar show/hide -+-+-+-+-+-+-+-+
	//subject
	private _showSidebarSubject = new BehaviorSubject<boolean>(false);   
	
	//getter
    public showSidebar = this._showSidebarSubject.asObservable();
	
	//setters
    public showTheSidebar() {
        this._showSidebarSubject.next(true);
    }
    public hideTheSidebar() {
        this._showSidebarSubject.next(false);
    }

   /*  public clearFilters(): Observable<any> {
        alert("in clear filter function");
        this._
    } */
}
