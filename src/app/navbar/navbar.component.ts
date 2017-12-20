import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/services/modal.service';

@Component({
  selector: 'navbar',
  template: `<div id="header">
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
                      <a (click)="showAboutModal()"><img id="helpIcon" src="assets/MoreInfo.png" title="Help" /></a>
                    </div>
                  </div>
                </div>
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

}
