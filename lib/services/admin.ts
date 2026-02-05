import api from '../api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getAllUsers: async (page = 1, limit = 10) => {
        const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
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

    getAllJobs: async (page = 1, limit = 10) => {
        const response = await api.get(`/admin/jobs?page=${page}&limit=${limit}`);
        return response.data;
    },

    updateJobStatus: async (jobId: string, status: string) => {
        const response = await api.patch(`/admin/jobs/${jobId}/status`, { status });
        return response.data;
    },
};
