import { fetchCompanyFull, fetchInnovXData, fetchHiringData } from "@/lib/queries";
import { notFound } from "next/navigation";
import { CompanyDetailClient } from "./CompanyDetailClient";

interface CompanyDetailProps {
    params: Promise<{ id: string }>;
}

export default async function CompanyDetail({ params }: CompanyDetailProps) {
    const { id } = await params;
    const company_id = parseInt(id, 10);

    if (isNaN(company_id)) notFound();

    // Fetch all three tables independently (no joins)
    const [companyRow, innovxRow, hiringRow] = await Promise.all([
        fetchCompanyFull(company_id),
        fetchInnovXData(company_id),
        fetchHiringData(company_id),
    ]);

    if (!companyRow || !companyRow.full_json) notFound();

    return (
        <CompanyDetailClient
            fullJson={companyRow.full_json}
            innovxData={innovxRow?.json_data ?? null}
            hiringData={hiringRow?.job_role_json ?? null}
        />
    );
}
