export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'FREELANCER' | 'EMPLOYER' | 'ADMIN';
    avatar?: string;
    bio?: string;
    headline?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    location?: string;
    skills?: string[];
    hourlyRate?: number;
    languages?: string[];
    education?: Education[];
    experience?: Experience[];
    resumeUrl?: string;
    resumeTemplate?: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Education {
    school: string;
    degree: string;
    year: string;
}

export interface Experience {
    company: string;
    role: string;
    duration: string;
    description: string;
}
