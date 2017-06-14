import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from "app/sidebar/sidebar.component";
import { NavbarComponent } from "app/navbar/navbar.component";
import { MainviewComponent } from "app/mainview/mainview.component";

@Component({
  selector: 'app-root',
  template: `
      <navbar></navbar>
      <sidebar></sidebar>
      <mainview></mainview>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild(SidebarComponent) sidebarComponent: SidebarComponent;    
  @ViewChild(MainviewComponent) mainviewCommponent: MainviewComponent;
}
