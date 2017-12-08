import { Injectable } from '@angular/core';
import { Map, geoJSON } from 'leaflet'
import * as L from 'leaflet';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CONFIG } from "./config";
import { Http, Response } from '@angular/http';
import { IchosenFilters } from 'app/shared/interfaces/chosenFilters.interface';


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
            OpenStreetMap: L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Topo: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
                attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            }),
            CartoDB: L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>"
            }),
            Satellite: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'//,
                //maxZoom: 10
            }),
            Terrain: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
                maxZoom: 13
            }),
            Gray: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
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

    //called after filtered modal closes and filters have been chosen
    public updateFilteredSites(filters: IchosenFilters){
        this.newFilteredGeoJsonArray = [];
        this.newFilteredGeoJson = new L.GeoJSON();
        this.filtersPassed = filters;
        let isPresent: boolean = false;
        let filteredSiteIds: Array<number> = [];
        // loop through all the geojson features to find filter matching properties
        this._filteredSiteViewSubject.getValue().features.forEach(feature => {            
            isPresent = false;
            let parameterArray = feature.properties.parameter_type_id ? feature.properties.parameter_type_id.split(",") : [];
            let projDurationArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let projStatusArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let resArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let mediaArray = feature.properties.media_type_id ? feature.properties.media_type_id.split(",") : [];
            let lakeArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let stateArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let monArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let org;
            let objectiveArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];

            // loop through to find if filters are in geojson
            for (let p of this.filtersPassed.s_parameters) {
                if (parameterArray.includes(p.toString())){
                    isPresent= true;
                    break;
                }
            }
/*            for (let p of this.filtersPassed.s_projDuration) {
                if (projDurationArray.includes(p.toString())){
                    isPresent= true;
                    break;
                }
            } // finish all loops
*/
            if (isPresent) {
                filteredSiteIds.push(feature.properties.site_id);
                this.newFilteredGeoJsonArray.push(feature);
            }
        }, this);
        let test = "hi";
        // set the filteredSiteView to be the new geojson
        //this.newFilteredGeoJson.addData(this.newFilteredGeoJsonArray);
        this.setFilteredSiteIDs(filteredSiteIds);
        this.setFilteredSiteView(this.newFilteredGeoJsonArray);
        
    }
    
    // takes in projectID, loops thru this.AllSiteView and grab all sites with matching projectIDs, hit setter for mapview.component's getter to get
    public AddTempSites(projectID: number) {
        let theseNewTemps = this._allSiteView.features.filter(function (feature) { return feature.properties.project_id == projectID; });
        if (this.temporarySites.length > 0) Array.prototype.push.apply(this.temporarySites,theseNewTemps);// this.temporarySites.concat(theseNewTemps);
        else this.temporarySites = theseNewTemps;
      /*  this._allSiteView.features.forEach(feature => {     
            if (feature.properties.project_id == projectID)
                this.temporarySites.push(feature);
        });*/
        this.setTempSites(this.temporarySites);      
    }

    //loop thru tempsites, remove all sites that are in projectID
    public RemoveTempSites(projectID:number){
        var i = this.temporarySites.length;
        while (i--) {
            if (this.temporarySites[i].properties.project_id == projectID) 
                this.temporarySites.splice(i, 1);            
        };        
        this.setTempSites(this.temporarySites);   
    }

    //initial http get of all geojson sites
    private httpRequest(): void {
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
