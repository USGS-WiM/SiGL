import { Component, Input,  OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "../../../shared/services/modal.service";

@Component({
    selector: 'userguide',
    templateUrl: './userguide.component.html',
    styles: [
        './userguide.component.css'
    ]
})
export class UserGuideComponent implements OnInit {
    @ViewChild('userguidemodal') public UserguideComponent;    
    private modalElement: any;
    
    //injects services into this component
    constructor(private _ngbService: NgbModal, private _modalService: ModalService) { }

    ngOnInit() {        
        this.modalElement = this.UserguideComponent;
        
        //show the filter modal == Change Filters button was clicked in sidebar
        this._modalService.showUserGuideModal.subscribe((show: boolean) => {
            if (show) this.showUserGuideModal();
        });


    }//end ngOnInit()

    public showUserGuideModal(): void {
        this._ngbService.open(this.modalElement, { backdrop: 'static', keyboard: false, size: 'lg' }).result.then((results) => {                  
            let closeResult = `Closed with: ${results}`;
            if (results == 'Clear'){
                
            }
           
        }, (reason) => {
            let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }//end showFilterModal
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }
    
}//end UserGuideComponent Class
