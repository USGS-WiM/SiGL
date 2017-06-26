import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";

@Injectable()
export class CONFIG {
    private static baseURL: string = "https://sigldev.wim.usgs.gov/SiGLServices/";

    public static get PARAMETERS_URL(): string { return this.baseURL + "Parameters"; };
    public static get PROJ_DURATIONS_URL(): string { return this.baseURL + "ProjectDuration"; };
    public static get PROJ_STATUS_URL(): string { return this.baseURL + "ProjectStatus"; };
    public static get RESOURCES_URL(): string { return this.baseURL + "ResourceTypes"; };
    public static get MEDIA_URL(): string { return this.baseURL + "Media"; };
    public static get LAKES_URL(): string { return this.baseURL + "Lakes"; };
    public static get STATES_URL(): string { return this.baseURL + "sites/StatesWithSites"; };
    public static get MONITOR_EFFORTS_URL(): string { return this.baseURL + "MonitorCoordinations"; };
    public static get FILTERED_SITES_URL(): string { return this.baseURL + "sites/FilteredSites"; };
    public static get FILTERED_PROJECTS_URL(): string { return this.baseURL + "projects/FilteredProjects"; };
    public static get PROJECT_URL(): string { return this.baseURL + "projects"; };
    public static get ORGANIZATION_URL(): string { return this.baseURL + "organizations"; };
    public static get OBJECTIVE_URL(): string {return this.baseURL + "objectives";};
    public static get MIN_JSON_HEADERS() { return new Headers({ "Accept": "application/json" }); };
    public static get JSON_HEADERS() { return new Headers({ "Accept": "application/json", "Content-Type": "application/json" }); };

}