import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { InnovXProject } from '@/types/schema';

/**
 * One enriched record returned per company:
 * the company row from innovx_json plus a pre-extracted projects array.
 */
export interface InnovXCompanyEntry {
    id: number;
    company_id: number;
    company_name: string;
    projects: InnovXProject[];
}

/**
 * GET /api/innovx-all
 * Returns all companies that have InnovX data, with their projects extracted
 * from json_data.innovx_projects. Cached for 60 s on the edge.
 */
export async function GET() {
    const { data, error } = await supabase
        .from('innovx_json')
        .select('id, company_id, name, json_data')
        .order('name');

    if (error) {
        console.error('[innovx-all] Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const entries: InnovXCompanyEntry[] = (data ?? []).map((row) => ({
        id: row.id,
        company_id: row.company_id,
        company_name: row.name ?? `Company ${row.company_id}`,
        projects: (row.json_data?.innovx_projects ?? []) as InnovXProject[],
    }));

    // Only include companies that actually have projects
    const withProjects = entries.filter((e) => e.projects.length > 0);

    return NextResponse.json(withProjects, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
    });
}
