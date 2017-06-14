import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  template: `<nav id="header" class="navbar nav-default navbar-fixed-top" role="navigation">
                <div id="usgsLogoDiv" class="navbar-header">
                  <img id="usgsLogo" alt="USGS Logo" src="assets/usgsLogo.png" /><!--</a>-->
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <div id="title">{{title}}</div>
                  <div id="titleSeparator">:</div>
                  <div id="subTitle">{{subtitle}}</div>
                </div>
            </nav>`,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public title: string;
  public subtitle: string;
  constructor() { }

  ngOnInit() {
    this.title = "SiGL";
    this.subtitle = "Science in the Great Lakes"
  }

}
