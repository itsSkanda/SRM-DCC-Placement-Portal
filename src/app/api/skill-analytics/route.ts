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

    return NextResponse.json(
        { skills, rows },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        }
    );
}
