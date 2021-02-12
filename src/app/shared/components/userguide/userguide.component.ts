// ------------------------------------------------------------------------------
// ------------ userguide.component ---------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     selector component that sits within the mapview.component.html page.
//              Modal that shows how to use the interface

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../shared/services/modal.service";

@Component({
    selector: "userguide",
    templateUrl: "./userguide.component.html",
    styleUrls: ["./userguide.component.css"],
})
export class UserGuideComponent implements OnInit {
    @ViewChild("userguidemodal") public UserguideComponent;
    @ViewChild("t") tabs;
    private modalElement: any;

    //injects services into this component
    constructor(
        private _ngbService: NgbModal,
        private _modalService: ModalService
    ) {}

    ngOnInit() {
        this.modalElement = this.UserguideComponent;

        //show the userguide modal == User Guide button was clicked in navbar
        this._modalService.showUserGuideModal.subscribe((show: boolean) => {
            if (show) this.showUserGuideModal();
        });
    } //end ngOnInit()

    // show the User Guide
    public showUserGuideModal(): void {
        this._ngbService
            .open(this.modalElement, {
                backdrop: "static",
                keyboard: false,
                size: "lg",
            })
            .result.then(
                (results) => {
                    let closeResult = `Closed with: ${results}`;
                },
                (reason) => {
                    let closeResult = `Dismissed ${this.getDismissReason(
                        reason
                    )}`;
                }
            );
    } //end showFilterModal
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }
} //end UserGuideComponent Class
