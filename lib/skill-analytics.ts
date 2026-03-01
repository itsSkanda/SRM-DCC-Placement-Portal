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

    const mapping: Record<string, string> = {
        "coding": "coding",
        "dsa": "data_structures_and_algorithms",
        "oop": "object_oriented_programming_and_design",
        "aptitude": "aptitude_and_problem_solving",
        "communication": "communication_skills",
        "ai": "ai_native_engineering",
        "cloud": "devops_and_cloud",
        "sql": "sql_and_design",
        "software": "software_engineering",
        "system": "system_design_and_architecture",
        "networking": "computer_networking",
        "os": "operating_system"
    };

    const processed = (data ?? []).map(s => {
        const name = s.skill_set_name.toLowerCase();
        let short = s.short_name;

        // Try to find a match in our manual mapping first
        for (const [key, col] of Object.entries(mapping)) {
            if (name.includes(key)) {
                short = col;
                break;
            }
        }

        return {
            ...s,
            short_name: (short || s.skill_set_name)
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '')
        };
    });

    return processed as SkillMasterRow[];
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

    // Sanitize keys to ensure they match internal short_names
    // Handles database columns that might have spaces or mixed casing
    const sanitized = (data ?? []).map(row => {
        const newRow: any = {};
        Object.entries(row).forEach(([key, value]) => {
            // Mapping logic: lowercase and remove spaces/special chars
            // e.g. "Software Architecture" -> "software_architecture"
            const cleanKey = key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            newRow[cleanKey] = value;

            // Also keep original key just in case
            if (cleanKey !== key) {
                newRow[key] = value;
            }
        });
        return newRow as CompanySkillLevelRow;
    });

    return sanitized;
}
