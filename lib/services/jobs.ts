import api from '../api';
import { Job } from '@/types/job';

const mapBackendJobToFrontendJob = (backendJob: any): Job => {
    // Helper to format date safely
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Recently posted';
            }

            // Calculate relative time
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
            if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
            return date.toLocaleDateString();
        } catch (error) {
            return 'Recently posted';
        }
    };

    // Helper to get company name
    const getCompanyName = () => {
        if (backendJob.companyName) return backendJob.companyName;
        if (backendJob.poster?.firstName && backendJob.poster?.lastName) {
            return `${backendJob.poster.firstName} ${backendJob.poster.lastName}`;
        }
        return undefined; // Return undefined instead of 'Unknown'
    };

    // Helper to get location
    const getLocation = () => {
        if (backendJob.location) return backendJob.location;
        if (backendJob.remote) return 'Remote';
        return undefined; // Return undefined instead of 'As specified'
    };

    // Helper to get salary
    const getSalary = () => {
        if (backendJob.budget) {
            return `$${backendJob.budget}${backendJob.budgetType === 'HOURLY' ? '/hr' : ''}`;
        }
        return undefined; // Return undefined instead of 'Negotiable'
    };

    return {
        id: backendJob.id,
        title: backendJob.title,
        company: getCompanyName(),
        location: getLocation(),
        type: backendJob.budgetType === 'HOURLY' ? 'Hourly' : 'Freelance',
        remote: backendJob.remote || false,
        budgetType: backendJob.budgetType,
        salary: getSalary(),
        posted: formatDate(backendJob.createdAt),
        tags: backendJob.skills || [],
        featured: false,
        category: backendJob.category,
        description: backendJob.description,
        requirements: backendJob.requirements || [],
        responsibilities: backendJob.responsibilities || [],
        companyWebsite: backendJob.poster?.website,
        companyEmail: backendJob.poster?.email,
        posterId: backendJob.posterId,
        status: backendJob.status,
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
