import { supabase } from './supabase';
import type {
    CompanyShortJson,
    CompanyFullJson,
    InnovXJsonData,
    JobRoleDetailsJsonData,
} from '@/types/schema';

// ─────────────────────────────────────────────────────────────────────────────
// company_json – short_json (for lists, cards, dashboard)
// ─────────────────────────────────────────────────────────────────────────────
export interface CompanyShortRow {
    json_id: number;
    company_id: number;
    short_json: CompanyShortJson;
}

export async function fetchAllCompaniesShort(): Promise<CompanyShortRow[]> {
    const { data, error } = await supabase
        .from('company_json')
        .select('json_id, company_id, short_json');

    if (error) {
        console.error('Error fetching company_json (short_json):', error.message);
        return [];
    }

    return (data ?? []) as CompanyShortRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// company_json – full_json (for company detail page, lazy on navigation)
// ─────────────────────────────────────────────────────────────────────────────
export interface CompanyFullRow {
    json_id: number;
    company_id: number;
    full_json: CompanyFullJson;
}

export async function fetchCompanyFull(
    company_id: number
): Promise<CompanyFullRow | null> {
    const { data, error } = await supabase
        .from('company_json')
        .select('json_id, company_id, full_json')
        .eq('company_id', company_id)
        .single();

    if (error) {
        console.error(
            `Error fetching company_json full_json for company_id=${company_id}:`,
            error.message
        );
        return null;
    }

    return data as CompanyFullRow;
}

// ─────────────────────────────────────────────────────────────────────────────
// innovx_json – json_data (for InnovX tab)
// ─────────────────────────────────────────────────────────────────────────────
export interface InnovXRow {
    id: number;
    company_id: number;
    name: string;
    json_data: InnovXJsonData;
}

export async function fetchInnovXData(
    company_id: number
): Promise<InnovXRow | null> {
    const { data, error } = await supabase
        .from('innovx_json')
        .select('id, company_id, name, json_data')
        .eq('company_id', company_id)
        .single();

    if (error) {
        // PGRST116 = no rows found – treat as empty, not an error
        if (error.code !== 'PGRST116') {
            console.error(
                `Error fetching innovx_json for company_id=${company_id}:`,
                error.message
            );
        }
        return null;
    }

    return data as InnovXRow;
}

// ─────────────────────────────────────────────────────────────────────────────
// job_role_details_json – job_role_json (for Hiring Rounds & Skills tabs)
// ─────────────────────────────────────────────────────────────────────────────
export interface JobRoleDetailsRow {
    id: number;
    company_id: number;
    company_name: string;
    job_role_json: JobRoleDetailsJsonData;
}

export async function fetchHiringData(
    company_id: number
): Promise<JobRoleDetailsRow | null> {
    const { data, error } = await supabase
        .from('job_role_details_json')
        .select('id, company_id, company_name, job_role_json')
        .eq('company_id', company_id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error(
                `Error fetching job_role_details_json for company_id=${company_id}:`,
                error.message
            );
        }
        return null;
    }

    return data as JobRoleDetailsRow;
}
