import api from '../api';

export interface HiringSolution {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
    color: string;
    bg: string;
    order: number;
}

export interface HiringStat {
    id: string;
    label: string;
    value: string;
    icon: string;
    order: number;
}

export interface HiringPlan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    order: number;
}

export interface HiringSolutionsData {
    solutions: HiringSolution[];
    stats: HiringStat[];
    plans: HiringPlan[];
}

export const hiringSolutionsService = {
    async getSolutions(): Promise<HiringSolution[]> {
        const response = await api.get('/hiring-solutions/solutions');
        return response.data;
    },

    async getStats(): Promise<HiringStat[]> {
        const response = await api.get('/hiring-solutions/stats');
        return response.data;
    },

    async getPlans(): Promise<HiringPlan[]> {
        const response = await api.get('/hiring-solutions/plans');
        return response.data;
    },

    // Admin methods
    async createSolution(data: Partial<HiringSolution>) {
        const response = await api.post('/hiring-solutions/solutions', data);
        return response.data;
    },

    async updateSolution(id: string, data: Partial<HiringSolution>) {
        const response = await api.put(`/hiring-solutions/solutions/${id}`, data);
        return response.data;
    },

    async deleteSolution(id: string) {
        const response = await api.delete(`/hiring-solutions/solutions/${id}`);
        return response.data;
    },

    async createStat(data: Partial<HiringStat>) {
        const response = await api.post('/hiring-solutions/stats', data);
        return response.data;
    },

    async updateStat(id: string, data: Partial<HiringStat>) {
        const response = await api.put(`/hiring-solutions/stats/${id}`, data);
        return response.data;
    },

    async deleteStat(id: string) {
        const response = await api.delete(`/hiring-solutions/stats/${id}`);
        return response.data;
    },

    async createPlan(data: Partial<HiringPlan>) {
        const response = await api.post('/hiring-solutions/plans', data);
        return response.data;
    },

    async updatePlan(id: string, data: Partial<HiringPlan>) {
        const response = await api.put(`/hiring-solutions/plans/${id}`, data);
        return response.data;
    },

    async deletePlan(id: string) {
        const response = await api.delete(`/hiring-solutions/plans/${id}`);
        return response.data;
    },
};
