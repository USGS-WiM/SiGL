import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "app/shared/services/modal.service";
import { SiglService } from "app/shared/services/siglservices.service";
import { IMultiSelectOption } from "angular-2-dropdown-multiselect";
import { Iparameter } from "app/shared/interfaces/parameter.interface";
import { IprojDuration } from "app/shared/interfaces/projduration.interface";
import { IprojStatus } from "app/shared/interfaces/projstatus.interface";
import { Iresource } from "app/shared/interfaces/resource.interface";
import { Imedia } from "app/shared/interfaces/media.interface";
import { Ilake } from "app/shared/interfaces/lake.interface";
import { Istate } from "app/shared/interfaces/state.interface";
import { ImonitorEffort } from "app/shared/interfaces/monitoreffort.interface";
import { Iproject } from "app/shared/interfaces/project.interface";
import { Iorganization } from "app/shared/interfaces/organization.interface";
import { Iobjective } from "app/shared/interfaces/objective.interface";
import { IchosenFilters } from "app/shared/interfaces/chosenFilters.interface";


@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styles: [
      './filter.component.css',
        '../../node_modules/bootstrap/dist/css/bootstrap.min.cs'
  ]
})
export class FilterComponent implements OnInit {
  @ViewChild('filtermodal') public FilterComponent;  
  @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to calling component
  private modalElement: any;
  //parameter
  public parameterMulti: Array<IMultiSelectOption>; //holds the parameter vals for the param groups
  public parameterSelected: Array<Number>;
  //project Duration
  public projDurationMulti: Array<IMultiSelectOption>;
  public projDurationSelected: Array<Number>;
  //project status
  public projStatusMulti: Array<IMultiSelectOption>;
  public projStatusSelected: Array<Number>;
  //resource component
  public resourceMulti: Array<IMultiSelectOption>;
  public resourceSelected: Array<Number>;
  //media
  public mediaMulti: Array<IMultiSelectOption>;
  public mediaSelected: Array<Number>;
  //lake
  public lakeMulti: Array<IMultiSelectOption>;
  public lakeSelected: Array<Number>;
  //state
  public stateMulti: Array<IMultiSelectOption>;
  public stateSelected: Array<Number>;
  //monitoring effort
  public monitoringEffortMulti: Array<IMultiSelectOption>;
  public monitoringEffortSelected: Array<Number>;
  //project
   public projectMulti: Array<IMultiSelectOption>;
  public projectSelected: Array<Number>;
  //organization
  public organizationMulti: Array<IMultiSelectOption>;
  public orgainzationSelected: Array<Number>;
  //objective
  public objectiveMulti: Array<IMultiSelectOption>;
  public objecttiveSelected: Array<Number>;

  public chosenFiltersObj: IchosenFilters;



  //injects services into this component
  constructor(private _ngbService: NgbModal, private _modalService: ModalService, private _siglService: SiglService) { }

  ngOnInit() {
    this.modalElement = this.FilterComponent;
    this._siglService.parameters.subscribe((params: Array<Iparameter>) => {
        this.parameterMulti = [];
        this.parameterMulti.push({id: 1000, name: "Biological" });
        params.forEach((pl) => {
            if (pl.parameter_group === "Biological")
                this.parameterMulti.push({id: pl.parameter_type_id, name: pl.parameter, parentId: 1000});
        });
        this.parameterMulti.push({id: 2000, name: "Chemical" });
        params.forEach((pl) => {
            if (pl.parameter_group === "Chemical")
                this.parameterMulti.push({id: pl.parameter_type_id, name: pl.parameter, parentId: 2000});
        });
        this.parameterMulti.push({id: 3000, name: "Microbiological" });
        params.forEach((pl) => {
            if (pl.parameter_group === "Microbiological")
                this.parameterMulti.push({id: pl.parameter_type_id, name: pl.parameter, parentId: 3000});
        });
        this.parameterMulti.push({id: 4000, name: "Physical" });
        params.forEach((pl) => {
            if (pl.parameter_group === "Physical")
                this.parameterMulti.push({id: pl.parameter_type_id, name: pl.parameter, parentId: 4000});
        });
        this.parameterMulti.push({id: 5000, name: "Toxicological" });
            params.forEach((pl) => {
            if (pl.parameter_group === "Toxicological")
                this.parameterMulti.push({id: pl.parameter_type_id, name: pl.parameter, parentId: 5000});
        });
    });
    this._siglService.projDurations.subscribe((durations: Array<IprojDuration>) => {
        this.projDurationMulti = [];
        durations.forEach((pd) => {
            this.projDurationMulti.push({ id: pd.proj_duration_id, name: pd.duration_value });
        });
    });
    this._siglService.projStatuses.subscribe((statuses: Array<IprojStatus>) => {
        this.projStatusMulti = [];
        statuses.forEach((ps) => {
            this.projStatusMulti.push({ id: ps.proj_status_id, name: ps.status_value });
        });
    });
    this._siglService.resources.subscribe((resources: Array<Iresource>) => {
        this.resourceMulti = [];
        resources.forEach((r) => {
            this.resourceMulti.push({ id: r.resource_type_id, name: r.resource_name });
        });
    });
    this._siglService.media.subscribe((media: Array<Imedia>) => {
        this.mediaMulti = [];
        media.forEach((m) => {
            this.mediaMulti.push({ id: m.media_type_id, name: m.media });
        });
    });
    this._siglService.lakes.subscribe((lakes: Array<Ilake>) => {
        this.lakeMulti = [];
        lakes.forEach((l) => {
            this.lakeMulti.push({ id: l.lake_type_id, name: l.lake });
        });
    });
    this._siglService.state.subscribe((states: Array<any>) => {
        this.stateMulti = [];
        states.forEach((s) => {
            this.stateMulti.push({id: s, name: s });
        });
    });
    this._siglService.monitorEffort.subscribe((monitorEfforts: Array<ImonitorEffort>) => {
        this.monitoringEffortMulti = [];
        monitorEfforts.forEach((me) => {
            this.monitoringEffortMulti.push({id: me.monitoring_coordination_id, name: me.effort });
        });
    });
    this._siglService.project.subscribe((projects: Array<Iproject>) => {
        this.projectMulti = [];
        projects.forEach((pr) => {
            this.projectMulti.push({id: pr.project_id, name: pr.name });
        });
    });
    this._siglService.organization.subscribe((organizations: Array<Iorganization>) => {
        this.organizationMulti = [];
        organizations.forEach((o) => {
            this.organizationMulti.push({id: o.organization_id, name: o.organization_name });
        });
    });
    this._siglService.objective.subscribe((objectives: Array<Iobjective>) => {
        this.objectiveMulti = [];
        objectives.forEach((ob) => {
            this.objectiveMulti.push({id: ob.objective_type_id, name: ob.objective });
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

  public filterChange(which: string, e: any): void {
      switch(which){
          case "parameters":
            this.chosenFiltersObj.s_parameters = [];
            this.chosenFiltersObj.PARAMETERS = [];
            e.forEach((eachParam) => {
                if (eachParam !== 1000 && eachParam !== 2000 && eachParam !== 3000 && eachParam !== 4000 && eachParam !== 5000){
                    //for the request
                    this.chosenFiltersObj.s_parameters.push(eachParam);
                    //for adding to the siebar
                    this.chosenFiltersObj.PARAMETERS.push(this.parameterMulti.filter((p: IMultiSelectOption ) => {return p.id == eachParam;})[0]);
                }
            });
            break;
        case "duration":
            this.chosenFiltersObj.s_projDuration = e;
            this.chosenFiltersObj.DURATIONS = [];
            e.forEach(eachParam => {
                this.chosenFiltersObj.DURATIONS.push(this.projDurationMulti.filter((d:IMultiSelectOption) => {return d.id == eachParam;})[0]);
            });
            break;
        case "status":
        this.chosenFiltersObj.s_projStatus = e;
        this.chosenFiltersObj.STATUSES = [];
        e.forEach(eachParam => {
            this.chosenFiltersObj.STATUSES.push(this.projDurationMulti.filter((st:IMultiSelectOption) => {return st.id == eachParam;})[0]);
        });
      }

  }

}
