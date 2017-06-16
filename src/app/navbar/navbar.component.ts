import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  template: `<div id="header">
                <div id="headerLogo">
                  <div id="usgsLogoDiv">
                    <img id="usgsLogo" alt="USGS Logo" title="USGS Links" src="assets/usgsLogo.png" /><!--</a>-->
                  </div>
                  <div id="titles">
                    <div id="betaTitle"></div>
                    <div id="title">{{title}}</div>
                    <div id="titleSeparator">:</div>
                    <div id="subTitle">
                      {{subtitle}}
                      <img id="helpIcon" src="assets/MoreInfo.png" title="Help" />
                    </div>
                  </div>
                </div>
            </div>`,
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
