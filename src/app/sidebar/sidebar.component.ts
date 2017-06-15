import { Component, OnInit } from '@angular/core';
import { BasemapsComponent } from "app/mainview/basemaps/basemaps.component";
import { ModalService } from "app/shared/services/modal.service";

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private _modalService: ModalService) { }

  ngOnInit() {
    // subscribe to get updates when things are changed in filtermodal
    
  } 
  
  // show filter button click
  public showFilterModal(): void {
    // change boolean value to show the modal (filter)
    this._modalService.showModal = true; 
  }

}
