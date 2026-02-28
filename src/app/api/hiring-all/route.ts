import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { JobRoleDetailsJsonData, JobRoleDetail } from '@/types/schema';

export interface HiringCompanyEntry {
    id: number;
    company_id: number;
    company_name: string;
    roles: JobRoleDetail[];
}

/**
 * GET /api/hiring-all
 * Returns all companies with hiring data, roles extracted from job_role_json.
 * Cached for 60 s on the edge.
 */
export async function GET() {
    const { data, error } = await supabase
        .from('job_role_details_json')
        .select('id, company_id, company_name, job_role_json')
        .order('company_name');

    if (error) {
        console.error('[hiring-all] Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const entries: HiringCompanyEntry[] = (data ?? []).map((row) => {
        const json = row.job_role_json as JobRoleDetailsJsonData | null;
        return {
            id: row.id,
            company_id: row.company_id,
            company_name: row.company_name ?? `Company ${row.company_id}`,
            roles: json?.job_role_details ?? [],
        };
    });

    // Only return companies that actually have roles
    const withRoles = entries.filter((e) => e.roles.length > 0);

    return NextResponse.json(withRoles, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
    });
}
