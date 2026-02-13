import { CompanyFull } from '../types/schema';

export const MOCK_COMPANIES: CompanyFull[] = [
    {
        company_id: 1,
        name: "Accenture plc",
        short_name: "Accenture",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        category: "Enterprise",
        operating_countries: "United States; United Kingdom; India; Germany; France",
        office_locations: "Bangalore, India; New York, USA; London, UK",
        employee_size: "740,000+",
        yoy_growth_rate: "3%",
        headquarters_address: "Dublin, Ireland",
        overview_text: "Accenture is a global professional services company with leading capabilities in digital, cloud and security. Combining unmatched experience and specialized skills across more than 40 industries, we offer Strategy and Consulting, Technology and Operations services and Accenture Song.",
        innovx_projects: [
            {
                project_name: "Accenture GenAI Factory",
                description: "Clients cannot industrialize GenAI use cases quickly.",
                difficulty: "High",
                real_world_relevance: "Critical",
                skill_mapping: "GenAI, Python, Cloud"
            }
        ],
        hiring_roles: [
            {
                role_title: "Software Engineer",
                compensation: "12 LPA",
                hiring_rounds: [
                    { round_number: 1, round_name: "Online Assessment", focus: "DSA & Aptitude" },
                    { round_number: 2, round_name: "Technical Interview", focus: "Core CS Concepts" }
                ]
            }
        ],
        skills_analysis: [
            { skill_area: "DSA", rating: 8, topics: "Arrays; Linked Lists; Trees" },
            { skill_area: "System Design", rating: 7, topics: "Load Balancers; Caching" }
        ]
    },
    {
        company_id: 2,
        name: "Atlassian Corporation",
        short_name: "Atlassian",
        logo_url: "https://w7.pngwing.com/pngs/320/267/png-transparent-atlassian-trello-jira-confluence-logo-tech-companies-thumbnail.png",
        category: "Product",
        operating_countries: "Australia; USA; India",
        office_locations: "Sydney, Australia; Bangalore, India; San Francisco, USA",
        employee_size: "10,000+",
        yoy_growth_rate: "15%",
        headquarters_address: "Sydney, Australia",
        overview_text: "Atlassian Corporation is an Australian software company that develops products for software developers, project managers, and other software development teams.",
        innovx_projects: [],
        hiring_roles: [],
        skills_analysis: []
    },
    {
        company_id: 3,
        name: "Google",
        short_name: "Google",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
        category: "Super Dream",
        operating_countries: "Global",
        office_locations: "Mountain View, USA; Bangalore, India; Hyderabad, India",
        employee_size: "180,000+",
        yoy_growth_rate: "10%",
        headquarters_address: "Mountain View, California",
        overview_text: "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware.",
        innovx_projects: [],
        hiring_roles: [],
        skills_analysis: []
    },
    {
        company_id: 4,
        name: "Microsoft",
        short_name: "Microsoft",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
        category: "Super Dream",
        operating_countries: "Global",
        office_locations: "Redmond, USA; Bangalore, India; IDC",
        employee_size: "220,000+",
        yoy_growth_rate: "8%",
        headquarters_address: "Redmond, Washington",
        overview_text: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
        innovx_projects: [],
        hiring_roles: [],
        skills_analysis: []
    },
    {
        company_id: 5,
        name: "Amazon",
        short_name: "Amazon",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
        category: "Super Dream",
        operating_countries: "Global",
        office_locations: "Seattle, USA; Bangalore, India; Hyderabad, India",
        employee_size: "1,500,000+",
        yoy_growth_rate: "12%",
        headquarters_address: "Seattle, Washington",
        overview_text: "Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
        innovx_projects: [],
        hiring_roles: [],
        skills_analysis: []
    }
];
