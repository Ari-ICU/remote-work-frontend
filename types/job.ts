export interface Job {
    id: string | number;
    title: string;
    company?: string;
    companyName?: string;
    location?: string;
    type: string;
    remote: boolean;
    budgetType: 'HOURLY' | 'FIXED';
    salary?: string;
    posted: string;
    tags: string[];
    featured: boolean;
    category: string;
    description?: string;
    requirements?: string[];
    responsibilities?: string[];
    companyWebsite?: string;
    companyEmail?: string;
    posterId?: string;
    status?: string;
}

export interface Category {
    name: string;
    count: number;
    icon: any; // Lucide icon type
    color: string;
}

export interface Stat {
    label: string;
    value: string;
}
