import { NextResponse } from 'next/server';
import { fetchSkillMaster, fetchCompanySkillLevels } from '@/lib/skill-analytics';

/**
 * GET /api/skill-analytics
 * Returns { skills, rows } for the Skill Analytics page.
 * Both Supabase calls run in parallel; result is edge-cached for 60 s.
 */
export async function GET() {
    const [skills, rows] = await Promise.all([
        fetchSkillMaster(),
        fetchCompanySkillLevels(),
    ]);

    console.log("[DEBUG API] Skills Count:", skills.length);
    console.log("[DEBUG API] First Row Keys:", rows.length > 0 ? Object.keys(rows[0]) : "Empty");
    if (rows.length > 0) {
        const atlassian = rows.find(r => r.companies.toLowerCase().includes('atlassian'));
        console.log("[DEBUG API] Atlassian Raw:", JSON.stringify(atlassian, null, 2));
    }

    return NextResponse.json(
        { skills, rows },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        }
    );
}
