// ------------------------------------------------------------------------------
// ------------ filter.component ------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     selector component that sits within the mapview.component.html page.
//              A modal containing all filter options for viewing projects and project sites. Opens from sidebar. Sends filters to siglService and mapService

import {
    Component,
    Input,
    EventEmitter,
    OnInit,
    ViewChild,
} from "@angular/core"; // Output,
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../shared/services/modal.service";
import { SiglService } from "../../../shared/services/siglservices.service";
import {
    IMultiSelectOption,
    IMultiSelectSettings,
} from "angular-2-dropdown-multiselect";
import { Iparameter } from "../../../shared/interfaces/parameter.interface";
import { IprojDuration } from "../../../shared/interfaces/projduration.interface";
import { IprojStatus } from "../../../shared/interfaces/projstatus.interface";
import { Iresource } from "../../../shared/interfaces/resource.interface";
import { Imedia } from "../../../shared/interfaces/media.interface";
import { Ilake } from "../../../shared/interfaces/lake.interface";
import { Istate } from "../../../shared/interfaces/state.interface";
import { ImonitorEffort } from "../../../shared/interfaces/monitoreffort.interface";
import { Iproject } from "../../../shared/interfaces/project.interface";
import { Iorganization } from "../../../shared/interfaces/organization.interface";
import { Iobjective } from "../../../shared/interfaces/objective.interface";
import { IchosenFilters } from "../../../shared/interfaces/chosenfilters.interface";
import { MapService } from "../../../shared/services/map.service";
import { prepareProfile } from "selenium-webdriver/firefox";
declare let gtag: Function;

@Component({
    selector: "filter",
    templateUrl: "./filter.component.html",
    styles: [
        "./filter.component.css",
        "../../node_modules/bootstrap/dist/css/bootstrap.min.cs",
    ],
})
export class FilterComponent implements OnInit {
    @ViewChild("filtermodal") public FilterComponent;
    // @Output() modalResponseEvent = new EventEmitter<boolean>(); // when they hit save, emit to calling component
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
    public projMulti: Array<IMultiSelectOption>;
    public projectSelected: Array<Number>;
    //public projectList: Array<Iproject>;
    //public projectSelected: Array<Number>;
    //organization
    public orgMulti: Array<IMultiSelectOption>;
    public orgSelected: Array<Number>;
    //objective
    public objectiveMulti: Array<IMultiSelectOption>;
    public objectiveSelected: Array<Number>;

    public chosenFiltersObj: IchosenFilters;

    //settings for multiselects -- makes them single select only
    public singleSettings: IMultiSelectSettings = {
        selectionLimit: 1,
        autoUnselect: true,
    };

    //injects services into this component
    constructor(
        private _ngbService: NgbModal,
        private _modalService: ModalService,
        private _siglService: SiglService,
        private _mapService: MapService
    ) {}

    ngOnInit() {
        //instantiate object
        this.chosenFiltersObj = {};

        this.modalElement = this.FilterComponent;

        // #start subscriptions to get dropdowns
        this._siglService.parameters.subscribe((params: Array<Iparameter>) => {
            this.parameterMulti = [];
            this.parameterMulti.push({ id: 1000, name: "Biological" });
            params.forEach((pl) => {
                if (pl.parameter_group === "Biological")
                    this.parameterMulti.push({
                        id: pl.parameter_type_id,
                        name: pl.parameter,
                        parentId: 1000,
                    });
            });
            this.parameterMulti.push({ id: 2000, name: "Chemical" });
            params.forEach((pl) => {
                if (pl.parameter_group === "Chemical")
                    this.parameterMulti.push({
                        id: pl.parameter_type_id,
                        name: pl.parameter,
                        parentId: 2000,
                    });
            });
            this.parameterMulti.push({ id: 3000, name: "Microbiological" });
            params.forEach((pl) => {
                if (pl.parameter_group === "Microbiological")
                    this.parameterMulti.push({
                        id: pl.parameter_type_id,
                        name: pl.parameter,
                        parentId: 3000,
                    });
            });
            this.parameterMulti.push({ id: 4000, name: "Physical" });
            params.forEach((pl) => {
                if (pl.parameter_group === "Physical")
                    this.parameterMulti.push({
                        id: pl.parameter_type_id,
                        name: pl.parameter,
                        parentId: 4000,
                    });
            });
            this.parameterMulti.push({ id: 5000, name: "Toxicological" });
            params.forEach((pl) => {
                if (pl.parameter_group === "Toxicological")
                    this.parameterMulti.push({
                        id: pl.parameter_type_id,
                        name: pl.parameter,
                        parentId: 5000,
                    });
            });
        });
        this._siglService.projDurations.subscribe(
            (durations: Array<IprojDuration>) => {
                this.projDurationMulti = [];
                durations.forEach((pd) => {
                    this.projDurationMulti.push({
                        id: pd.proj_duration_id,
                        name: pd.duration_value,
                    });
                });
            }
        );
        this._siglService.projStatuses.subscribe(
            (statuses: Array<IprojStatus>) => {
                this.projStatusMulti = [];
                statuses.forEach((ps) => {
                    this.projStatusMulti.push({
                        id: ps.proj_status_id,
                        name: ps.status_value,
                    });
                });
            }
        );
        this._siglService.resources.subscribe((resources: Array<Iresource>) => {
            this.resourceMulti = [];
            resources.forEach((r) => {
                this.resourceMulti.push({
                    id: r.resource_type_id,
                    name: r.resource_name,
                });
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
                this.stateMulti.push({ id: s, name: s });
            });
        });
        this._siglService.monitorEffort.subscribe(
            (monitorEfforts: Array<ImonitorEffort>) => {
                this.monitoringEffortMulti = [];
                monitorEfforts.forEach((me) => {
                    this.monitoringEffortMulti.push({
                        id: me.monitoring_coordination_id,
                        name: me.effort,
                    });
                });
            }
        );
        this._siglService.project.subscribe((projects: Array<Iproject>) => {
            this.projMulti = [];
            projects.forEach((proj) => {
                this.projMulti.push({ id: proj.project_id, name: proj.name });
            });
        });
        this._siglService.organization.subscribe(
            (organizations: Array<Iorganization>) => {
                this.orgMulti = [];
                organizations.forEach((org) => {
                    this.orgMulti.push({
                        id: org.organization_id,
                        name: org.organization_name,
                    });
                });
            }
        );
        this._siglService.objective.subscribe(
            (objectives: Array<Iobjective>) => {
                this.objectiveMulti = [];
                objectives.forEach((ob) => {
                    this.objectiveMulti.push({
                        id: ob.objective_type_id,
                        name: ob.objective,
                    });
                });
            }
        );
        // #end subscriptions to get dropdowns

        //show the filter modal == Change Filters button was clicked in sidebar
        this._modalService.showFilterModal.subscribe((show: boolean) => {
            if (show) {
                this.showFilterModal();
            }
        });

        this._siglService.clearAllFilters.subscribe(
            (buttonClicked: boolean) => {
                if (buttonClicked == true) {
                    this.Clear();
                }
            }
        );
    } //end ngOnInit()

    // show the Filter Modal and handle when it is closed
    public showFilterModal(): void {
        this._ngbService
            .open(this.modalElement, {
                backdrop: "static",
                keyboard: false,
                size: "lg",
            })
            .result.then(
                (results) => {
                    let closeResult = `Closed with: ${results}`;
                    // need to emit out since this is a selector component sitting in the mapview.component.html page
                    //  this.modalResponseEvent.emit(results);
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

    public Clear() {
        gtag("event", "click", {
            event_category: "Filter",
            event_label: "filterCleared",
        });
        //reset all selects in the modal
        this.parameterSelected = [];
        this.projDurationSelected = [];
        this.projStatusSelected = [];
        this.resourceSelected = [];
        this.mediaSelected = [];
        this.lakeSelected = [];
        this.stateSelected = [];
        this.monitoringEffortSelected = [];
        this.orgSelected = [];
        this.objectiveSelected = [];
        this.projectSelected = [];
        //clear sidebar
        this.chosenFiltersObj = {};
        // let the map and sidebar know everything was cleared
        this._mapService.updateFilteredSites(this.chosenFiltersObj); //updates map geojson
        this._siglService.setFilteredSites(this.chosenFiltersObj); //updates project and sites from services in the List of Projects
    }
    // each time a dropdown value (all except for Project Name) changes this happens
    public filterChange(which: string, e: any): void {
        // if they've previously chosen a Project name to filter, clear it out now and let the map and sidebar know
        if (this.chosenFiltersObj.ProjectName) {
            this.projectSelected = [];
            delete this.chosenFiltersObj.ProjectName;

            this._mapService.updateFilteredSites(this.chosenFiltersObj); //updates map geojson
            this._siglService.setFilteredSites(this.chosenFiltersObj); //updates project and sites from services in the List of Projects
        }
        // determine which dropdown is being changed and update the chosenFiltersObj object (add to it or remove it -- check or uncheck)
        switch (which) {
            case "parameters":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_parameters = [];
                    this.chosenFiltersObj.PARAMETERS = [];
                    e.forEach((eachParam) => {
                        if (
                            eachParam !== 1000 &&
                            eachParam !== 2000 &&
                            eachParam !== 3000 &&
                            eachParam !== 4000 &&
                            eachParam !== 5000
                        ) {
                            //for the request
                            this.chosenFiltersObj.s_parameters.push(eachParam);
                            //for adding to the siebar
                            this.chosenFiltersObj.PARAMETERS.push(
                                this.parameterMulti.filter(
                                    (p: IMultiSelectOption) => {
                                        return p.id == eachParam;
                                    }
                                )[0]
                            );
                        }
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_parameters;
                    delete this.chosenFiltersObj.PARAMETERS;
                }
                break;
            case "duration":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_projDuration = e;
                    this.chosenFiltersObj.DURATIONS = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.DURATIONS.push(
                            this.projDurationMulti.filter(
                                (d: IMultiSelectOption) => {
                                    return d.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_projDuration;
                    delete this.chosenFiltersObj.DURATIONS;
                }
                break;
            case "status":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_projStatus = e;
                    this.chosenFiltersObj.STATUSES = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.STATUSES.push(
                            this.projStatusMulti.filter(
                                (s: IMultiSelectOption) => {
                                    return s.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_projStatus;
                    delete this.chosenFiltersObj.STATUSES;
                }
                break;
            case "resource":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_resources = e;
                    this.chosenFiltersObj.RESOURCES = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.RESOURCES.push(
                            this.resourceMulti.filter(
                                (re: IMultiSelectOption) => {
                                    return re.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_resources;
                    delete this.chosenFiltersObj.RESOURCES;
                }
                break;
            case "media":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_media = e;
                    this.chosenFiltersObj.MEDIA = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.MEDIA.push(
                            this.mediaMulti.filter((m: IMultiSelectOption) => {
                                return m.id == eachParam;
                            })[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_media;
                    delete this.chosenFiltersObj.MEDIA;
                }
                break;
            case "lake":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_lakes = e;
                    this.chosenFiltersObj.LAKES = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.LAKES.push(
                            this.lakeMulti.filter((l: IMultiSelectOption) => {
                                return l.id == eachParam;
                            })[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_lakes;
                    delete this.chosenFiltersObj.LAKES;
                }
                break;
            case "state":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_states = e;
                    this.chosenFiltersObj.STATES = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.STATES.push(
                            this.stateMulti.filter((st: IMultiSelectOption) => {
                                return st.id == eachParam;
                            })[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_states;
                    delete this.chosenFiltersObj.STATES;
                }
                break;
            case "monitoring":
                if (e.length > 0) {
                    this.chosenFiltersObj.s_monitorEffect = e;
                    this.chosenFiltersObj.MONITORS = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.MONITORS.push(
                            this.monitoringEffortMulti.filter(
                                (me: IMultiSelectOption) => {
                                    return me.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.s_monitorEffect;
                    delete this.chosenFiltersObj.MONITORS;
                }
                break;
            case "organization":
                if (e.length > 0) {
                    this.chosenFiltersObj.p_organization = e;
                    this.chosenFiltersObj.ORG = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.ORG.push(
                            this.orgMulti.filter((org: IMultiSelectOption) => {
                                return org.id == eachParam;
                            })[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.p_organization;
                    delete this.chosenFiltersObj.ORG;
                }
                break;
            case "objective":
                if (e.length > 0) {
                    this.chosenFiltersObj.p_objectives = e;
                    this.chosenFiltersObj.OBJS = [];
                    e.forEach((eachParam) => {
                        this.chosenFiltersObj.OBJS.push(
                            this.objectiveMulti.filter(
                                (ob: IMultiSelectOption) => {
                                    return ob.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.p_objectives;
                    delete this.chosenFiltersObj.OBJS;
                }
                break;
            case "project":
                if (e.length > 0) {
                    this.chosenFiltersObj = {};
                    this.chosenFiltersObj.p_project = e;
                    this.chosenFiltersObj.PROJ = [];
                    e.forEach((eachParam) => {
                        let testVar = this.projMulti.filter(
                            (proj: IMultiSelectOption) => {
                                return proj.id == eachParam;
                            }
                        );
                        this.chosenFiltersObj.PROJ.push(
                            this.projMulti.filter(
                                (proj: IMultiSelectOption) => {
                                    return proj.id == eachParam;
                                }
                            )[0]
                        );
                    });
                } else {
                    //remove it
                    delete this.chosenFiltersObj.p_project;
                    delete this.chosenFiltersObj.PROJ;
                }
                break;
        } //end switch
        // let google analytics know of the event
        gtag("event", "click", {
            event_category: "Filter",
            event_label: "filterChange: " + (which + ": {" + e + "}"),
        });

        if (this.chosenFiltersObj.PROJ) {
            this.onProjectSelect(this.chosenFiltersObj.PROJ);
        } else {
            // send filters to mapService and siglService to get FilteredProjects listed and update geojson
            this._mapService.updateFilteredSites(this.chosenFiltersObj); //updates map geojson
            this._siglService.setFilteredSites(this.chosenFiltersObj); //updates project and sites from services in the List of Projects
        }
    } // end filterChange

    // Project Name was changed in filters
    public onProjectSelect(project: any) {
        if (project != "") {
            // reset all selects in the modal
            this.parameterSelected = [];
            this.projDurationSelected = [];
            this.projStatusSelected = [];
            this.resourceSelected = [];
            this.mediaSelected = [];
            this.lakeSelected = [];
            this.stateSelected = [];
            this.monitoringEffortSelected = [];
            this.orgSelected = [];
            this.objectiveSelected = [];
            // reset everything just in case (so that the filters apply to all and not a previous subset)
            delete this.chosenFiltersObj.p_project;
            delete this.chosenFiltersObj.PROJ;
            this._mapService.updateFilteredSites(this.chosenFiltersObj); //updates map geojson
            this._siglService.setFilteredSites(this.chosenFiltersObj); //updates project and sites from services in the List of Projects
            this.chosenFiltersObj.ProjectName = {
                name: project[0].name,
                project_id: project[0].id,
            };
        } else {
            this.chosenFiltersObj = {};
        }
        // let google analytics know of the event
        gtag("event", "click", {
            event_category: "Filter",
            event_label: "filterbyProject: " + project.name,
        });
        // send filters to mapService and siglService to get FilteredProjects listed and update geojson
        this._mapService.updateFilteredSites(this.chosenFiltersObj); //updates map geojson
        this._siglService.setFilteredSites(this.chosenFiltersObj); //updates project and sites from services in the List of Projects
    } //end onProjectSelect
} //end FilterComponent Class
