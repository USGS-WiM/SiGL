import { Isimplesite } from "app/shared/interfaces/simplesite";

export interface Ifilteredproject {
    name: string;
    project_id: number;
    projectSites: Array<Isimplesite>;
    isCollapsed?:boolean;
}
