export interface Isiteview {
    site_id: number;
    project_id: number;
    latitude: number;
    longitude: number;
    geom: any;
    lake_type_id: number;
    state_province: string;
    proj_duration_id: string;
    proj_status_id: string;
    project_name: string;
    organization_system_id?: string;
    objective_id?: string;
    monitoring_coordination_id?: string;
    media_type_id?: string;
    resource_type_id?: string;
    parameter_type_id?: string;
}