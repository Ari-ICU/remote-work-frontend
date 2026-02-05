import api from '../api';

export const applicationService = {
    apply: async (jobId: string, applicationData: any) => {
        const response = await api.post(`/applications/${jobId}`, applicationData);
        return response.data;
    },

    getForJob: async (jobId: string) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return response.data;
    },

    getMyApplications: async () => {
        const response = await api.get('/applications/me');
        return response.data;
    }
};
