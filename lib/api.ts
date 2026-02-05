import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getJobs = async () => {
    try {
        const response = await api.get('/jobs');
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

export const getJob = async (id: string) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching job ${id}:`, error);
        return null;
    }
};

export default api;
