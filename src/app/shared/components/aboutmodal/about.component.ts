// ------------------------------------------------------------------------------
// ------------ about.component -------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     selector component that sits within the mapview.component.html page. 
//              Modal containing additional project information, metadata, and disclaimers. Opens from navbar.

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "../../../shared/services/modal.service";
import { SiglService } from '../../../shared/services/siglservices.service';
import { Iproject } from '../../../shared/interfaces/project.interface';
import { MapService } from '../../../shared/services/map.service';
import { Isite } from '../../../shared/interfaces/site.interface';
import { Iorganization } from 'app/shared/interfaces/organization.interface';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['about.component.css']
})

export class AboutComponent implements OnInit {
    @ViewChild('aboutmodal') public AboutComponent;
    private modalElement: any;
    public appVersion: string;
    public nowDate: Date;
    public projectCount: number;
    public siteCount: number;
    public orgCount: number;

    // injects services into this component
    constructor(private _ngbService: NgbModal, private _modalService: ModalService, private _siglService: SiglService) { }

    ngOnInit() {
        this.modalElement = this.AboutComponent;
        this.nowDate = new Date();

        this._siglService.project.subscribe((projects: Array<Iproject>) => {
            this.projectCount = projects.length;
        });
        this._siglService.sites.subscribe((s: Array<Isite>) => {
            this.siteCount = s.length;
        });
        this._siglService.organization.subscribe((o: Array<Iorganization>) => {
            this.orgCount = o.length;
        });
        // show the about modal == About button was clicked in navbar
        this._modalService.showAboutModal.subscribe((show: boolean) => {
            if (show) this.showAboutModal();
        });
        if (document.cookie.includes("SiGLcookie")){
			this._modalService.showAboutModal = false;
		} else {
			this._modalService.showAboutModal = true;
			this.checkCookie();
		}

        // application version percolated up from package.json -> environments -> app.module -> app.component -> siglServices -> here to show version #
        this._siglService.getVersion.subscribe((v: string) => {
            this.appVersion = v;
        });
    }//end ngOnInit()

    public showAboutModal(): void {
        this._ngbService.open(this.modalElement, { backdrop: 'static', keyboard: false, size: 'lg' }).result.then((results) => {
            let closeResult = `Closed with: ${results}`;
        }, (reason) => {
            let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }//end showFilterModal

    // not really needed for about modal
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    public setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	public getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	public checkCookie() {
		var user = "You have returned!";
		this.setCookie("SiGLcookie", user, 365);
	}

}//end AboutComponent Class
