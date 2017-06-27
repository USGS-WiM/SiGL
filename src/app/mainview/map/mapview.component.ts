import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from "app/shared/services/map.service";
import { FilterComponent } from "app/shared/components/filter/filter.component";
import { ResizeEvent } from "angular-resizable-element/dist/esm/src";
import { SiglService } from "app/shared/services/siglservices.service";
import { Ifullproject } from "app/shared/interfaces/fullproject.interface";
import { Ifullsite } from "app/shared/interfaces/fullsite.interface";

@Component({
  selector: 'mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit {  
  
  // filter modal, opened from sidebar's (click) function that changing show boolean, subscribed to in the filterModalComponent
  @ViewChild('filtermodal') filtermodal: FilterComponent;
  public map: any;
  public style: Object = {};
  public fullProj: Ifullproject;
  public fullProjSites: Array<Ifullsite>;
  public showBottomBar: Boolean;
  constructor( private _mapService: MapService, private _siglService: SiglService) { }

  ngOnInit() {
    this.showBottomBar = false;
    this._siglService.fullProject.subscribe((FP: Ifullproject) => {
      this.fullProj = FP;
      this.showBottomBar = true;
    });
    this._siglService.fullProjectSites.subscribe((FPS: Array<Ifullsite>) => {
      this.fullProjSites = FPS;
    });

      this.map = L.map("map", {
            center: L.latLng(44.2, -88.01),
            zoom: 6,
            minZoom: 4,
            maxZoom: 19,
            layers: [this._mapService.baseMaps.Topo]
      });
      //L.control.layers(this._mapService.baseMaps).addTo(this.map);
      L.control.scale().addTo(this.map);
     // this._mapService.map = map;       
      L.control.scale().addTo(this.map);

      this._mapService.map = this.map;
      
      this.style = {
       position: 'fixed',
       bottom: '0px',
       'z-index': '1001',
       display: 'flex',
       width: '100%',
       height: '150px',
       'background-color': '#f7f7f9',
       color: '#121621',
       margin: 'auto',
       left: '400px'
     }
  }

  // response from filter modal closing
  public FilterModalResponse(r){
    let test = "what";
  }

  public onResizeEnd(event: ResizeEvent): void {
   this.style = {
     'z-index': '1001',
     position: 'fixed',
     left: `400px`,
     bottom: '0px',
     top: `${event.rectangle.top}px`,
     width: `${event.rectangle.width}px`,
     height: `${event.rectangle.height}px`,
     'background-color': '#f7f7f9',
     color: '#121621',
     margin: 'auto'
   };
 }

}
