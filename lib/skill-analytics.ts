import { supabase } from './supabase';

// ─── Types ─────────────────────────────────────────────────────────────────────

/** One row from skill_set_master */
export interface SkillMasterRow {
    skill_set_id: number;
    skill_set_name: string;
    short_name: string;
    skill_set_description: string | null;
}

/**
 * One row from staging_company_skill_levels.
 * The company name is in the `companies` column.
 * All skill level values are text (e.g. "Intermediate", "Advanced").
 */
export interface CompanySkillLevelRow {
    id: number;
    companies: string;          // company name column
    processed: boolean | null;
    processed_at: string | null;
    error_message: string | null;
    created_at: string | null;
    // Dynamic skill columns - keyed by column name matching skill_set_master.short_name
    [skillKey: string]: string | number | boolean | null;
}

// ─── Queries ───────────────────────────────────────────────────────────────────

/**
 * Fetch all skill metadata from skill_set_master.
 * Ordered by skill_set_id so column order is stable.
 */
export async function fetchSkillMaster(): Promise<SkillMasterRow[]> {
    const { data, error } = await supabase
        .from('skill_set_master')
        .select('skill_set_id, skill_set_name, short_name, skill_set_description')
        .order('skill_set_id');

    if (error) {
        console.error('[skill-analytics] fetchSkillMaster error:', error.message);
        return [];
    }
    return (data ?? []) as SkillMasterRow[];
}

/**
 * Fetch all rows from staging_company_skill_levels.
 * Fetches all rows (processed and unprocessed) so we never miss data.
 * Ordered alphabetically by company name.
 */
export async function fetchCompanySkillLevels(): Promise<CompanySkillLevelRow[]> {
    const { data, error } = await supabase
        .from('staging_company_skill_levels')
        .select('*')
        .order('companies');

    if (error) {
        console.error('[skill-analytics] fetchCompanySkillLevels error:', error.message);
        return [];
    }
    return (data ?? []) as CompanySkillLevelRow[];
}
