import axios from 'axios';

import { Job } from '@/types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const mapBackendJobToFrontendJob = (backendJob: any): Job => {
    return {
        id: backendJob.id,
        title: backendJob.title,
        company: backendJob.poster ? `${backendJob.poster.firstName} ${backendJob.poster.lastName}` : 'Unknown',
        location: backendJob.location || (backendJob.remote ? 'Remote' : 'Unknown'),
        type: backendJob.budgetType === 'HOURLY' ? 'Hourly' : 'Fixed Price',
        salary: backendJob.budget ? `$${backendJob.budget}` : 'Negotiable',
        posted: new Date(backendJob.createdAt).toLocaleDateString(),
        tags: backendJob.skills || [],
        featured: false,
        category: backendJob.category,
        description: backendJob.description,
        requirements: [],
        responsibilities: [],
    };
};

export const getJobs = async () => {
    try {
        const response = await api.get('/jobs');
        return response.data.map(mapBackendJobToFrontendJob);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

export const getJob = async (id: string) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return mapBackendJobToFrontendJob(response.data);
    } catch (error) {
        console.error(`Error fetching job ${id}:`, error);
        return null;
    }
};

export default api;
