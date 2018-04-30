// ------------------------------------------------------------------------------
// ------------ map.service -----------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Service for the map. setters/getters needed to communicate information with the mapview.component

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Map, geoJSON } from 'leaflet'
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CONFIG } from "./config";
import { IchosenFilters } from '../../shared/interfaces/chosenFilters.interface';
import { LoaderService } from '../../shared/services/loader.service';

// import { isPending } from 'q'; // not sure why this is imported here, maybe started, but not finished?

@Injectable()
export class MapService {
    private _allSiteView: any;
    public map: Map;
    public baseMaps: any;
    public additionalLayers: any;
    public filtersPassed: IchosenFilters;
    private newFilteredGeoJson: L.GeoJSON;
    private newFilteredGeoJsonArray: Array<any>;
    private temporarySites: any = []; //add/subtract temp sites to show in map

    constructor(private _http: Http, private _loaderService: LoaderService) {
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
        this.additionalLayers = {
            areas: esri.featureLayer({
                url: "https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/1",
                style: function(){
                    return {color: 'blue', weight: 0.5 };
                },
                pane: 'areas'
            }),
            ceded: L.tileLayer.wms("http://wms.glifwc.org/?", {
                layers: "ceded_territories_polys",
                format: 'image/png',
                transparent: true,
                pane: "ceded"
            }),
            tribal: esri.featureLayer({
                url: "https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/4",
                style: function(){
                    return {color: '#80002a', weight: 0.5 };
                },
                pane: 'tribal'
            }),
            basins: esri.featureLayer({
                url: "https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3",
                style: function (feature) {
                    
                    if (feature.properties.MDA2 == "LS") {
                        return { color: 'DarkCyan', weight: 0 };
                    }
                    if (feature.properties.MDA2 == "LM") {
                        return { color: '#7b7737', weight: 0 };
                    }
                    if (feature.properties.MDA2 == "LH") {
                        return { color: 'IndianRed', weight: 0 };
                    }
                    if (feature.properties.MDA2 == "LE") {
                        return { color: 'Olive', weight: 0 };
                    }
                    if (feature.properties.MDA2 == "LO") {
                        return { color: 'MediumPurple', weight: 0 };
                    };
                },
                pane: 'basins'
            })
        }
        //this.temporarySites = [];
        this.httpRequest();
        this.setFilteredSiteIDs([]);
    }

    //subjects
    private _filteredSiteViewSubject: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");
    private _filteredSiteIDsSubject: BehaviorSubject<Array<number>> = new BehaviorSubject([]); //used to let sidebar know which sites are the filtered results for styling
    private _tempSiteSubject: Subject<any> = new Subject<any>();
    private _allShowingProjectIDs: Subject<Array<number>> = new Subject<Array<number>>();
    private _allOrgSystems: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");
    private _siteClicked: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject({});
    private _projectNameClicked: BehaviorSubject<boolean> = <BehaviorSubject<boolean>> new BehaviorSubject(false);
    
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
    public setProjectNameClicked(wasClicked: boolean){
        this._projectNameClicked.next(wasClicked);
    }
    // clear filters and give back all
    public get AllSiteView(): Observable<any> {
        return this._allSiteView;
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
    public get projectNameClicked(): Observable<boolean>{
        return this._projectNameClicked.asObservable();
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
        let theseNewTemps = this._allSiteView.features.filter((feature) => { 
            return feature.properties.project_id == projectID && (this._filteredSiteIDsSubject.getValue()).indexOf(feature.properties.site_id) < 0; 
        });

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
        this._loaderService.showFullPageLoad();
        let options = new RequestOptions({ headers: CONFIG.MIN_JSON_HEADERS });
        this._http.get(CONFIG.ORG_SYSTEM_URL, options)
            .map(res => <any>res.json())
            .catch((err, caught) => this.handleError(err, caught))
            .subscribe(orgSys => {
                this._allOrgSystems.next(orgSys);
            });
        this._http.get(CONFIG.SITE_URL + "/GetSiteView.geojson")
            .map(res => <any>res.json())
            .catch((err, caught) => this.handleError(err, caught))
            .subscribe(geoj => {
                this._loaderService.hideFullPageLoad();
                this._allSiteView = geoj;
                // this.setAllSiteView(geoj);
                this.setFilteredSiteView(geoj);
            });
    }

    //Error Handler
    private handleError(error: any, caught: any) {
        this._loaderService.hideFullPageLoad();
		let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);		        
    }
}
