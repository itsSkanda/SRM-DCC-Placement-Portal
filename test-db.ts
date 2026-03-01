import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: companies } = await supabase.from('company_json').select('company_id, short_json');
    const { data: hiring } = await supabase.from('job_role_details_json').select('company_id, job_role_json');

    console.log(`Found ${companies?.length} companies, ${hiring?.length} hiring details.`);

    if (companies && companies.length > 0) {
        console.log("Example categories currently in DB:", Array.from(new Set(companies.map(c => c.short_json.category))));
    }
}
run();
