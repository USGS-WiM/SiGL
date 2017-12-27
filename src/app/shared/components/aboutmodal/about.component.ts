import { Component, Input,  OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "../../../shared/services/modal.service";
import { SiglService } from '../../../shared/services/siglservices.service';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',    
    styleUrls: ['about.component.css']
})
export class AboutComponent implements OnInit {
    @ViewChild('aboutmodal') public AboutComponent;    
    private modalElement: any;    
    public appVersion: string;

    //injects services into this component
    constructor(private _ngbService: NgbModal, private _modalService: ModalService, private _siglService: SiglService) { }

    ngOnInit() {        
        this.modalElement = this.AboutComponent;
        
        //show the filter modal == Change Filters button was clicked in sidebar
        this._modalService.showAboutModal.subscribe((show: boolean) => {
            if (show) this.showAboutModal();
        });
        this._siglService.getVersion.subscribe((v: string) => {
            this.appVersion = v;
        });
    }//end ngOnInit()

    public showAboutModal(): void {
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
    
}//end AboutComponent Class
