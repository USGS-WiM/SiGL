import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `<div class="sidebar sidebar-left" id="sidebar">
    HERES THE SIDEBAR
            <!--<accordion>
                <accordion-group #group1>
                    <div accordion-heading>Basemaps
                        <i class="pull-right float-xs-right glyphicon" [ngClass]="{'glyphicon-chevron-down': group1?.isOpen, 'glyphicon-chevron-right': !group1?.isOpen}"></i>
                    </div>
                    <basemaps></basemaps>                             
                </accordion-group>
                <accordion-group #group2>
                    <div accordion-heading>Filters
                        <i class="pull-right float-xs-right glyphicon" [ngClass]="{'glyphicon-chevron-down': group2?.isOpen, 'glyphicon-chevron-right': !group2?.isOpen}"></i>
                    </div>
                    <filterside></filterside>                    
                </accordion-group>
            </accordion> -->
        </div>`,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
