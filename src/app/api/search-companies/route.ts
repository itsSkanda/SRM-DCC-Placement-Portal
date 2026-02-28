import { NextResponse } from 'next/server';
import { fetchAllCompaniesShort } from '@/lib/queries';

/**
 * GET /api/search-companies
 * Returns a slim list of all companies for the navbar autocomplete search.
 * Fetched server-side so Supabase credentials stay out of the browser bundle.
 */
export async function GET() {
    const rows = await fetchAllCompaniesShort();

    const companies = rows.map((row) => ({
        company_id: row.company_id,
        name: row.short_json?.name ?? '',
        category: row.short_json?.category ?? '',
        logo_url: row.short_json?.logo_url ?? '',
    }));

    return NextResponse.json(companies, {
        headers: {
            // Cache for 60 s on the edge / CDN – data rarely changes
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
    });
}
