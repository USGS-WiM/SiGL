import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from "app/sidebar/sidebar.component";
import { NavbarComponent } from "app/navbar/navbar.component";
import { MapviewComponent } from "app/mainview/map/mapview.component";


@Component({
  selector: 'app-root',
  template: `
      <loader-div></loader-div>     
      <navbar></navbar>
      <sidebar></sidebar>
      <mapview></mapview>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild(SidebarComponent) sidebarComponent: SidebarComponent;    
  @ViewChild(MapviewComponent) mapviewComponent: MapviewComponent;

}
