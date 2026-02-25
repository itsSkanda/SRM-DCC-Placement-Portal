import { fetchAllCompaniesShort } from "@/lib/queries";
import { CompaniesClient } from "./CompaniesClient";

export default async function CompaniesPage() {
    const rows = await fetchAllCompaniesShort();

    return (
        <div className="space-y-6 fade-in">
            <CompaniesClient rows={rows} />
        </div>
    );
}
