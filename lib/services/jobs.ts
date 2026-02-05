import api from '../api';
import { Job } from '@/types/job';

const mapBackendJobToFrontendJob = (backendJob: any): Job => {
    return {
        id: backendJob.id,
        title: backendJob.title,
        company: backendJob.poster ? `${backendJob.poster.firstName} ${backendJob.poster.lastName}` : 'Unknown',
        location: backendJob.location || (backendJob.remote ? 'Remote' : 'As specified'),
        type: backendJob.budgetType === 'HOURLY' ? 'Hourly' : 'Freelance',
        remote: backendJob.remote || false,
        budgetType: backendJob.budgetType,
        salary: backendJob.budget ? `$${backendJob.budget}${backendJob.budgetType === 'HOURLY' ? '/hr' : ''}` : 'Negotiable',
        posted: new Date(backendJob.createdAt).toLocaleDateString(),
        tags: backendJob.skills || [],
        featured: false,
        category: backendJob.category,
        description: backendJob.description,
        requirements: backendJob.requirements || [],
        responsibilities: backendJob.responsibilities || [],
    };
};

export const jobsService = {
    getAll: async () => {
        const response = await api.get('/jobs');
        return response.data.map(mapBackendJobToFrontendJob);
    },

    getCategories: async () => {
        const response = await api.get('/jobs/categories');
        return response.data;
    },

    getFeaturedCompanies: async () => {
        const response = await api.get('/jobs/companies');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/jobs/${id}`);
        return mapBackendJobToFrontendJob(response.data);
    },

    create: async (jobData: any) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    update: async (id: string, jobData: any) => {
        const response = await api.patch(`/jobs/${id}`, jobData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    },

    getMyJobs: async () => {
        const response = await api.get('/jobs/my-jobs');
        return response.data;
    }
};
