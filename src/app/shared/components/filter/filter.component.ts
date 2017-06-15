import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "app/shared/services/modal.service";

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChild('filtermodal') public FilterComponent;  
  @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to calling component
  private modalElement: any;

  constructor(private _ngbService: NgbModal, private _modalService: ModalService) { }

  ngOnInit() {
    this.modalElement = this.FilterComponent;
    //show the filter modal == Change Filters button was clicked in sidebar
    this._modalService.showModal.subscribe((show: boolean) => {
        if (show) this.showFilterModal();            
    });                
  }

  public showFilterModal(): void {
    this._ngbService.open(this.modalElement, {backdrop:'static', keyboard: false, size: 'lg' }).result.then((results) => {
      //they closed modal, do stuff 
      this.modalResponseEvent.emit(results);
    })
  }

}
