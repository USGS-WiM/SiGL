import { Injectable } from '@angular/core';
import { Map, geoJSON } from 'leaflet'
import * as L from 'leaflet';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CONFIG } from "./config";
import { Http, Response, RequestOptions } from '@angular/http';
import { IchosenFilters } from '../../shared/interfaces/chosenFilters.interface';
import { isPending } from 'q';
//import { isPending } from 'q';

@Injectable()
export class MapService {

    private _allSiteView: any;
    public map: Map;
    public baseMaps: any;
    public filtersPassed: IchosenFilters;
    private newFilteredGeoJson: L.GeoJSON;
    private newFilteredGeoJsonArray: Array<any>;
    private temporarySites: any = []; //add/subtract temp sites to show in map

    constructor(private _http: Http) {
        this.baseMaps = {// {s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png  
            OpenStreetMap: L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Imagery from <a href="https://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Topo: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
                attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            }),
            CartoDB: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://cartodb.com/attributions'>CartoDB</a>"
            }),
            Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'//,
                //maxZoom: 10
            }),
            Terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
                maxZoom: 13
            }),
            Gray: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                maxZoom: 16
            })
        };
        //this.temporarySites = [];
        this.httpRequest();
        this.setFilteredSiteIDs([]);

    }

    //subject
    //  private _allSiteViewSubject: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");
    private _filteredSiteViewSubject: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");
    private _filteredSiteIDsSubject: BehaviorSubject<Array<number>> = new BehaviorSubject([]); //used to let sidebar know which sites are the filtered results for styling
    private _tempSiteSubject: Subject<any> = new Subject<any>();
    private _allShowingProjectIDs: Subject<Array<number>> = new Subject<Array<number>>();
    private _allOrgSystems: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");
    private _siteClicked: Subject<any> = new Subject<any>();
    
    //initial set of all geojson sites. keep for resetting
    public setAllSiteView(geoJson: any) {
        this._allSiteView = geoJson;//this._allSiteViewSubject.next(geoJSON); 
    }
    //set array of filtered site id's 
    public setFilteredSiteIDs(siteIds: Array<number>) {
        this._filteredSiteIDsSubject.next(siteIds);
    }
    // setter for filtered geojson sites based on filters chosen
    public setFilteredSiteView(geoJson: any) {
        this._filteredSiteViewSubject.next(geoJson);
    }
    // setter for filtered geojson sites based on filters chosen
    public setTempSites(tempSites: any) {
        this._tempSiteSubject.next(tempSites);
    }
    public setAllShowingProjectIds(projIDs: Array<number>) {
        this._allShowingProjectIDs.next(projIDs);
    }
    public setSiteClicked(site: any) {
        this._siteClicked.next(site);
    }
    // clear filters and give back all
    public get AllSiteView(): Observable<any> {
        return this._allSiteView;// this._allSiteViewSubject.asObservable(); 
    }

    // siglServices wants array of filtered site id's 
    public get filteredSiteIDs(): Observable<Array<number>> {
        return this._filteredSiteIDsSubject;
    }
    // mainview subscribed to this for filtered sites
    public get filteredSiteView(): Observable<any> {
        return this._filteredSiteViewSubject.asObservable();
    }
    // mainview subscribed to this for temporary sites
    public get tempSites(): Observable<any> {
        return this._tempSiteSubject.asObservable();
    }
    public get allShowingProjectIds(): Observable<Array<number>> {
        return this._allShowingProjectIDs.asObservable();
    }
    public get siteClicked(): Observable<any>{
        return this._siteClicked.asObservable();
    }
    //called after filtered modal closes and filters have been chosen
    public updateFilteredSites(filters: IchosenFilters) {
        // whenever filters are updated, clear out the temporarySites
        this.temporarySites = [];
        if (Object.keys(filters).length > 0) {
            this.newFilteredGeoJsonArray = [];
            this.newFilteredGeoJson = new L.GeoJSON();
            this.filtersPassed = filters;
            let isPresent: boolean = false;
            let filteredSiteIds: Array<number> = [];
            // loop through all the geojson features to find filter matching properties (think we need to search through all '_allSiteView' instead of '_filteredSiteViewSubject' here every time)
            if (Array.isArray(this._allSiteView)) { // if (Array.isArray(this._filteredSiteViewSubject.getValue())) {
                let stop = "stopHere to see what this._filteredSiteViewSubject is and why it's getting an error";
                this._allSiteView.forEach(feature => { // this._filteredSiteViewSubject.getValue().forEach(feature => {
                    // isPresent = false;
                    isPresent = this.findPresentProps(feature, this.filtersPassed);
                    if (isPresent) {
                        filteredSiteIds.push(feature.properties.site_id);
                        this.newFilteredGeoJsonArray.push(feature);
                    }
                }, this);
            } else {
                this._allSiteView.features.forEach(feature => { // this._filteredSiteViewSubject.getValue().features.forEach(feature => {
                    // isPresent = false;
                    isPresent = this.findPresentProps(feature, this.filtersPassed);
                    if (isPresent) {
                        filteredSiteIds.push(feature.properties.site_id);
                        this.newFilteredGeoJsonArray.push(feature);
                    }
                }, this);
            }
            // set the filteredSiteView to be the new geojson
            //this.newFilteredGeoJson.addData(this.newFilteredGeoJsonArray);
            this.setFilteredSiteIDs(filteredSiteIds);
            this.setFilteredSiteView(this.newFilteredGeoJsonArray);
           // this._siglService.setFilteredSites(filters);

        } else {
            //repopulate map with all the sites
            this.setFilteredSiteView(this._allSiteView);
        }
    }

    // used in updateFilteredSites function above
    private findPresentProps(aFeature, filters): boolean {
        let isPresent: Array<boolean> = [];
        let parameterArray = aFeature.properties.parameter_type_id ? aFeature.properties.parameter_type_id.split(",") : [];        
        let projDurationArray = aFeature.properties.proj_duration_id ? aFeature.properties.proj_duration_id.split(",") : [];
        let projStatusArray = aFeature.properties.proj_status_id ? aFeature.properties.proj_status_id.split(",") : [];
        let resArray = aFeature.properties.resource_type_id ? aFeature.properties.resource_type_id.split(",") : [];
        let mediaArray = aFeature.properties.media_type_id ? aFeature.properties.media_type_id.split(",") : [];
        let lakeVal = aFeature.properties.lake_type_id ? aFeature.properties.lake_type_id : 0;
        let stateVal = aFeature.properties.state_province ? aFeature.properties.state_province : "";
        let monArray = aFeature.properties.monitoring_coordination_id ? aFeature.properties.monitoring_coordination_id.split(",") : [];
        let orgSysArray = aFeature.properties.organization_system_id ? aFeature.properties.organization_system_id.split(",") : [];
        let objectiveArray = aFeature.properties.objective_id ? aFeature.properties.objective_id.split(",") : [];
        let projectVal = aFeature.properties.project_id;
        if (filters.ProjectName) {
            let projHere: boolean = false;
            if (filters.ProjectName.project_id == projectVal) {
                projHere = true;
            }
            isPresent.push(projHere);
        } else {
            // loop through to find if filters are in geojson
            if (filters.s_parameters) {
                let paramHere: boolean = false;
                for (let p of filters.s_parameters) {
                    if (parameterArray.includes(p.toString())) {
                        paramHere = true;
                    }
                }
                isPresent.push(paramHere);
            }
            if (filters.s_projDuration) {
                let durHere: boolean = false;
                for (let p of filters.s_projDuration) {
                    if (projDurationArray.includes(p.toString())) {
                       durHere = true;
                    }
                }
                isPresent.push(durHere);
            }
            if (filters.s_projStatus) {
                let statHere: boolean = false;
                for (let p of filters.s_projStatus) {
                    if (projStatusArray.includes(p.toString())) {
                        statHere = true;
                    }
                }
                isPresent.push(statHere);
            }
            if (filters.s_resources) {           
                let resHere: boolean = false;
                for (let p of filters.s_resources) {
                    if (resArray.includes(p.toString())) {
                        resHere = true;
                    }
                }
                isPresent.push(resHere);
            }
            if (filters.s_media) {
                let medHere: boolean = false;
                for (let p of filters.s_media) {
                    if (mediaArray.includes(p.toString())) {
                        medHere = true;
                    }
                }
                isPresent.push(medHere);
            }
            if (filters.s_lakes) {
                let lakeHere: boolean = false;
                for (let p of filters.s_lakes) {
                    if (lakeVal == p) {
                        lakeHere = true;
                    }
                }
                isPresent.push(lakeHere);
            }
            if (filters.s_states) {
                let stateHere: boolean = false;
                for (let p of filters.s_states) {
                    if (stateVal == p.toString()) {
                        stateHere = true;
                    }
                }
                isPresent.push(stateHere);
            }
            if (filters.s_monitorEffect) {
                let monHere: boolean = false;
                for (let p of filters.s_monitorEffect) {
                    if (monArray.includes(p.toString())) {
                        monHere = true;
                    }
                }
                isPresent.push(monHere);
            }
            if (filters.p_objectives) {
                let objHere: boolean = false;
                for (let p of filters.p_objectives) {
                    if (objectiveArray.includes(p.toString())) {
                        objHere = true;
                    }
                }
                isPresent.push(objHere);
            }
            if (filters.ORG) {
                let orgHere: boolean = false;
                // all orgSystems that have this orgId
                let orgSystemsWithThisOrg = this._allOrgSystems.getValue().filter(function (orgsSys) { return orgsSys.org_id == filters.ORG.organization_id; })
                // loop through and see if any of them include this filters.ORG.organization_id
                let stophere = "hey!";
                orgSystemsWithThisOrg.forEach(sys => {
                    if (orgSysArray.includes(sys.organization_system_id.toString())) {
                        orgHere = true;
                    };
                });
                isPresent.push(orgHere);
            }
            // finish all loops
        }
        let finalTruth = isPresent.filter(p=> {return p == false;}).length;
        return finalTruth > 0 ? false : true;


    }
    // takes in projectID, loops thru this.AllSiteView and grab all sites with matching projectIDs, hit setter for mapview.component's getter to get
    public AddTempSites(projectID: number) {
        let theseNewTemps = this._allSiteView.features.filter(function (feature) { return feature.properties.project_id == projectID; });

        if (this.temporarySites.length > 0) {
            // first see if these are already showing
            let test = this.temporarySites.filter(ts => { return ts.properties.project_id == projectID });
            if (test.length == 0)
                Array.prototype.push.apply(this.temporarySites, theseNewTemps);
        } else {
            this.temporarySites = theseNewTemps;
        }
        /*  this._allSiteView.features.forEach(feature => {     
              if (feature.properties.project_id == projectID)
                  this.temporarySites.push(feature);
          });*/
        this.setTempSites(this.temporarySites);
    }

    //loop thru tempsites, remove all sites that are in projectID
    public RemoveTempSites(projectID: number) {
        var i = this.temporarySites.length;
        while (i--) {
            if (this.temporarySites[i].properties.project_id == projectID)
                this.temporarySites.splice(i, 1);
        };
        this.setTempSites(this.temporarySites);
    }

    //initial http get of all geojson sites
    private httpRequest(): void {
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        this._http.get(CONFIG.ORG_SYSTEM_URL, options)
            .map(res => <any>res.json())
            .subscribe(orgSys => {
                this._allOrgSystems.next(orgSys);
            });
        this._http.get(CONFIG.SITE_URL + "/GetSiteView.geojson")
            .map(res => <any>res.json())
            .subscribe(geoj => {
                this._allSiteView = geoj;
                // this.setAllSiteView(geoj);
                this.setFilteredSiteView(geoj);
            }, error => this.handleError);
    }

    //Error Handler
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server Error");
    }
}
