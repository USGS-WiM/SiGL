// ------------------------------------------------------------------------------
// ------------ navbar.component ------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The navbar component is along the top of the application and contains the About and User Guide buttons

import { Component, OnInit } from '@angular/core';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'navbar',
  template: `<div id="navbar">
                <div id="headerLogo">
                  <div id="usgsLogoDiv">
                    <img id="usgsLogo" alt="USGS Logo" title="USGS Links" src="assets/usgsLogo.png" /><!--</a>-->
                  </div>
                  <div id="titles">
                    <div class="appname">
                        <div id="betaTitle"></div>
                        <div id="title">{{title}}</div>
                        <div id="titleSeparator">:</div>
                    </div>
                    <div id="subTitle">
                      {{subtitle}}
                      
                    </div>                    
                  </div>                  
                </div>
                <button type="button" class="aboutNav pull-right" (click)="showAboutModal()"><i class="fa fa-info-circle"></i>&nbsp;&nbsp;About</button>                      
                <button type="button" class="aboutNav pull-right" (click)="showUserGuideModal()"><i class="fa fa-book"></i>&nbsp;&nbsp;UserGuide</button>
            </div>`,
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  public title: string;
  public subtitle: string;
  constructor(private _modalService: ModalService) { }

  ngOnInit() {
    this.title = "SiGL";
    this.subtitle = "Science in the Great Lakes"
  }
  public showAboutModal(){
    this._modalService.showAboutModal = true;
  }
  public showUserGuideModal(){
    this._modalService.showUserGuideModal = true;
  }

}
