import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/services/modal.service';

@Component({
  selector: 'navbar',
  template: `<div id="navbar">
                <div id="headerLogo">
                  <div id="usgsLogoDiv">
                    <i class="fa fa-bars" id="mobileMenuBtn"></i>
                    <img id="usgsLogo" alt="USGS Logo" title="USGS Links" src="assets/usgsLogo.png" /><!--</a>-->
                  </div>
                  <div id="titles">
                    <div class="appname">
                        Science in the Great Lakes (SiGL)
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
