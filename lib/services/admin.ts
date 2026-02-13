import api from '../api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    search: async (query: string) => {
        const response = await api.get(`/admin/search?q=${query}`);
        return response.data;
    },

    getAllUsers: async (page = 1, limit = 10, search?: string) => {
        const url = `/admin/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    createUser: async (data: any) => {
        const response = await api.post('/admin/users', data);
        return response.data;
    },

    updateUser: async (userId: string, data: any) => {
        const response = await api.patch(`/admin/users/${userId}`, data);
        return response.data;
    },

    updateUserRole: async (userId: string, role: string) => {
        const response = await api.patch(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    deleteUser: async (userId: string) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    getAllJobs: async (page = 1, limit = 10, search?: string) => {
        const url = `/admin/jobs?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    updateJobStatus: async (jobId: string, status: string) => {
        const response = await api.patch(`/admin/jobs/${jobId}/status`, { status });
        return response.data;
    },

    getAllApplications: async (page = 1, limit = 10) => {
        const response = await api.get(`/admin/applications?page=${page}&limit=${limit}`);
        return response.data;
    },

    updateApplicationStatus: async (applicationId: string, status: string) => {
        const response = await api.patch(`/admin/applications/${applicationId}/status`, { status });
        return response.data;
    },

    getAllPayments: async (page = 1, limit = 10) => {
        const response = await api.get(`/admin/payments?page=${page}&limit=${limit}`);
        return response.data;
    },

    getAllReviews: async (page = 1, limit = 10) => {
        const response = await api.get(`/admin/reviews?page=${page}&limit=${limit}`);
        return response.data;
    },

    deleteReview: async (reviewId: string) => {
        const response = await api.delete(`/admin/reviews/${reviewId}`);
        return response.data;
    },

    cleanupTestData: async () => {
        const response = await api.delete('/admin/cleanup-test-data');
        return response.data;
    },

    // Pricing Management
    getPricingPlans: async () => {
        const response = await api.get('/pricing/plans');
        return response.data;
    },

    createPricingPlan: async (data: any) => {
        const response = await api.post('/pricing/admin/plans', data);
        return response.data;
    },

    updatePricingPlan: async (id: string, data: any) => {
        const response = await api.patch(`/pricing/admin/plans/${id}`, data);
        return response.data;
    },


    deletePricingPlan: async (id: string) => {
        const response = await api.delete(`/pricing/admin/plans/${id}`);
        return response.data;
    },


    getPlatformSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updatePlatformSettings: async (data: any) => {
        const response = await api.patch('/admin/settings', data);
        return response.data;
    }
};

