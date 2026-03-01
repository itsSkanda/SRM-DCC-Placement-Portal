import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

let supabaseUrl = '';
let supabaseKey = '';

try {
    const env = fs.readFileSync('.env.local', 'utf-8');
    for (const line of env.split('\n')) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
    }
} catch (e) {
    console.log("Error reading env file", e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: companies } = await supabase.from('company_json').select('company_id, short_json, full_json');
    const { data: hiring } = await supabase.from('job_role_details_json').select('company_id, job_role_json');

    if (!companies || !hiring) return console.log("No data");

    const hiringMap = new Map(hiring.map(h => [h.company_id, h.job_role_json]));

    let stats = {
        marquee: 0,
        superDream: 0,
        dream: 0,
        core: 0,
        it: 0,
        startup: 0,
        unclassified: 0
    };

    const results: any[] = [];
    const updates: any[] = [];

    for (const company of companies) {
        const hData = hiringMap.get(company.company_id);

        let maxCtc = 0;
        if (hData && hData.job_role_details) {
            for (const role of hData.job_role_details) {
                if (role.ctc_or_stipend) {
                    if (role.ctc_or_stipend > maxCtc) maxCtc = role.ctc_or_stipend;
                }
            }
        }

        const currentCategory = company.short_json.category || '';
        const currentTier = company.short_json.tier_level || '';

        // Let's deduce what the company is
        let newCat = "IT"; // Default

        // 1. Core Engineering
        if (/core|aerospace|mechanical|electronics/i.test(currentCategory) || currentCategory.toLowerCase().trim() === 'engineering') {
            newCat = "Core";
        }
        // 2. Startups
        else if (/startup|fintech startup/i.test(currentCategory) || /startup/i.test(currentTier)) {
            newCat = "Startups";
        }
        // Then package-based classification
        else if (maxCtc >= 20_00_000) {
            newCat = "Marquee";
        } else if (maxCtc >= 10_00_000) {
            newCat = "Super Dream";
        } else if (maxCtc >= 5_00_000) {
            newCat = "Dream";
        } else {
            // Under 5LPA, usually mass recruiters / IT
            // Or if CTC is 0 (missing), keep it as IT or maybe infer from Tier
            if (currentTier.includes('Tier 1')) newCat = "Marquee"; // Example override
            else if (currentTier.includes('Tier 2')) newCat = "Super Dream";
            else if (currentTier.includes('Tier 3')) newCat = "Dream";
            else newCat = "IT";
        }

        if (newCat === "Marquee") stats.marquee++;
        else if (newCat === "Super Dream") stats.superDream++;
        else if (newCat === "Dream") stats.dream++;
        else if (newCat === "Core") stats.core++;
        else if (newCat === "Startups") stats.startup++;
        else if (newCat === "IT") stats.it++;
        else stats.unclassified++;

        results.push({
            id: company.company_id,
            name: company.short_json.name,
            oldCat: currentCategory,
            tier: currentTier,
            maxCtc,
            newCat
        });

        // Prepare update
        const newShort = { ...company.short_json, category: newCat };
        const newFull = { ...company.full_json, category: newCat };
        updates.push({
            company_id: company.company_id,
            short_json: newShort,
            full_json: newFull
        });
    }

    console.log(stats);
    fs.writeFileSync('category-analysis.json', JSON.stringify(results, null, 2));

    // Actually update the DB
    console.log(`Updating ${updates.length} records in DB...`);
    let count = 0;
    for (const batch of chunkArray(updates, 10)) {
        for (const data of batch) {
            const { error } = await supabase.from('company_json').update({
                short_json: data.short_json,
                full_json: data.full_json
            }).eq('company_id', data.company_id);
            if (error) console.error("Update error ID", data.company_id, error.message);
        }
    }
    console.log("Update complete.");
}

function chunkArray(array: any[], size: number) {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

run();
