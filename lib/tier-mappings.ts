/**
 * Hardcoded tier mappings for companies to ensure consistent categorization 
 * without modifying the underlying database.
 */

export const COMPANY_TIER_OVERRIDES: Record<string, string> = {
    "Google": "Tier 1",
    "Microsoft": "Tier 1",
    "Amazon": "Tier 1",
    "Meta": "Tier 1",
    "Apple": "Tier 1",
    "Netflix": "Tier 1",
    "Adobe": "Tier 1",
    "Uber": "Tier 1",
    "Atlassian": "Tier 1",
    "Salesforce": "Tier 1",
    "Goldman Sachs": "Tier 1",
    "Morgan Stanley": "Tier 1",
    "J.P. Morgan": "Tier 1",
    "DE Shaw": "Tier 1",
    "Tower Research": "Tier 1",
    "Citadel": "Tier 1",
    "NVIDIA": "Tier 1",
    "Intel": "Tier 1",
    "Qualcomm": "Tier 1",
    "Samsung": "Tier 1",
    "Visa": "Tier 1",
    "Mastercard": "Tier 1",
    "PayPal": "Tier 1",
    "Stripe": "Tier 1",
    "Tesla": "Tier 1",
    "SpaceX": "Tier 1",
    "Oracle": "Tier 1",
    "Cisco": "Tier 1",
    "Walmart Global Tech": "Tier 1",
    "Target": "Tier 1",
    "Intuit": "Tier 1",
    "ServiceNow": "Tier 1",
    "Zomato": "Tier 1",
    "Swiggy": "Tier 1",
    "Ola": "Tier 1",
    "Paytm": "Tier 1",
    "Flipkart": "Tier 1",
    "Freshworks": "Tier 1",
    "BrowserStack": "Tier 1",
    "Postman": "Tier 1",
    "Razorpay": "Tier 1",

    // Tier 2: Mid-tier Corporate Giants
    "Accenture": "Tier 2",
    "TCS": "Tier 2",
    "Tata Consultancy Services": "Tier 2",
    "Wipro": "Tier 2",
    "Infosys": "Tier 2",
    "Cognizant": "Tier 2",
    "CTS": "Tier 2",
    "Capgemini": "Tier 2",
    "HCL": "Tier 2",
    "Tech Mahindra": "Tier 2",
    "LTI": "Tier 2",
    "Mindtree": "Tier 2",
    "Deloitte": "Tier 2",
    "PwC": "Tier 2",
    "EY": "Tier 2",
    "KPMG": "Tier 2",
    "IBM": "Tier 2",
    "Oracle Cloud": "Tier 2",
    "SAP": "Tier 2",
    "CGI": "Tier 2",
    "Virtusa": "Tier 2",
    "Zensar": "Tier 2",
    "Persistent Systems": "Tier 2",
    "Mphasis": "Tier 2",

    "夢想 (Dream)": "Tier 3", // Example local mapping
};

/**
 * Returns the tier level for a company, prioritizing hardcoded overrides,
 * then the database value, and finally a default fallback.
 */
export function getCompanyTier(name: string | undefined, dbTier: string | undefined): string {
    if (!name) return dbTier || "Tier 3";

    // Check for exact match
    if (COMPANY_TIER_OVERRIDES[name]) return COMPANY_TIER_OVERRIDES[name];

    // Check for partial match (e.g. "Amazon.com" -> "Amazon")
    for (const [key, value] of Object.entries(COMPANY_TIER_OVERRIDES)) {
        if (name.includes(key) || key.includes(name)) return value;
    }

    return dbTier || "Tier 3";
}

/**
 * Normalizes tier names for consistent UI display (e.g. "tier 1" -> "Tier 1")
 */
export function normalizeTier(tier: string | undefined): string {
    if (!tier) return "Tier 3";
    const lower = tier.toLowerCase();
    if (lower.includes('1')) return "Tier 1";
    if (lower.includes('2')) return "Tier 2";
    if (lower.includes('3')) return "Tier 3";
    return tier;
}
