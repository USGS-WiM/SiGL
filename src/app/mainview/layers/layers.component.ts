// ------------------------------------------------------------------------------
// ------------ layers.component ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The layers component is a selector component that contains the additional layers for the map.

import { Component, OnInit } from '@angular/core';
import { MapService } from "../../shared/services/map.service";

declare let gtag: Function;

@Component({
  selector: 'layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {
  public additionalLayers: any;
  public chosenLayers: Array<string>;
  public areasCheck: boolean;
  public glriCheck:boolean;
  public cededCheck: boolean;
  public tribalCheck: boolean;
  constructor(private _mapService: MapService) { }

  ngOnInit() { 
    this.chosenLayers = [];
    this.areasCheck = false;
    this.glriCheck = false;
    this.cededCheck = false;
    this.tribalCheck = false;
  }

  public toggleLayer(newVal: string){
    let index = this.chosenLayers.indexOf(newVal);
    if (index > -1) {
      //already on, turn it off and remove from array
      this.chosenLayers.splice(index, 1);
      this._mapService.map.removeLayer(this._mapService.additionalLayers[newVal]);
    } else {
      // not in there yet, turn it on and add to array
      this.chosenLayers.push(newVal);
      this._mapService.map.addLayer(this._mapService.additionalLayers[newVal]);
    }
    
    // now add the one they want
 //   this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);

 //   gtag('event', 'click', {'event_category': 'Basemaps','event_label': 'basemap: ' + newVal});
  
  }

}
