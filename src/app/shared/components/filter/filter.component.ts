import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "app/shared/services/modal.service";
import { SiglService } from "app/shared/services/siglservices.service";
import { Iparameter } from "app/shared/interfaces/parameter.interface";
import { IMultiSelectOption } from "angular-2-dropdown-multiselect";


@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChild('filtermodal') public FilterComponent;  
  @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to calling component
  private modalElement: any;
  public paramList: Array<Iparameter>;
  public parameterMulti: Array<IMultiSelectOption>; //holds the parameter vals for the param groups
  public parameterSelected: Array<Number>;

  //injects services into this component
  constructor(private _ngbService: NgbModal, private _modalService: ModalService, private _siglService: SiglService) { }

  ngOnInit() {
    this.modalElement = this.FilterComponent;
    this._siglService.parameters.subscribe((params: Array<Iparameter>) => {
        this.parameterMulti = [];
        params.forEach((p) => {
            this.parameterMulti.push({id:p.parameter_type_id, name:p.parameter});
        });


    });
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
