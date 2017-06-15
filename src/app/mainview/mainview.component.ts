import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from "app/shared/services/map.service";
import { FilterComponent } from "app/shared/components/filter/filter.component";

@Component({
  selector: 'mainview',
  template: `<filter #filtermodal (modalResponseEvent)="FilterModalResponse($event)"></filter>
              <div id="map"></div>`,
  styleUrls: ['./mainview.component.css']
})
export class MainviewComponent implements OnInit {  
  // filter modal, opened from sidebar's (click) function that changing show boolean, subscribed to in the filterModalComponent
  @ViewChild('filtermodal') filtermodal: FilterComponent; 
  public map: any;
  constructor( private _mapService: MapService) { }

  ngOnInit() {
      this.map = L.map("map", {
            center: L.latLng(40.731253, -73.996139),
            zoom: 5,
            minZoom: 4,
            maxZoom: 19,
            layers: [this._mapService.baseMaps.Topo]
      });
      L.control.layers(this._mapService.baseMaps).addTo(this.map);
      L.control.scale().addTo(this.map);
     // this._mapService.map = map;       
      L.control.scale().addTo(this.map);

      this._mapService.map = this.map; 
  }

  // response from filter modal closing
  public FilterModalResponse(r){
    let test = "what";
  }

}
