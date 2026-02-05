export interface Job {
    id: string | number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    tags: string[];
    featured: boolean;
    category: string;
    description?: string;
    requirements?: string[];
    responsibilities?: string[];
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
