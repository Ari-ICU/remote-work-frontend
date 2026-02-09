import api from '../api';

export interface SalaryRole {
    id: string;
    title: string;
    range: string;
    experience: string;
    categoryId: string;
}

export interface SalaryCategory {
    id: string;
    name: string;
    roles: SalaryRole[];
    order: number;
}

export interface SalaryInsight {
    id: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    bg: string;
    order: number;
}

export interface SalaryGuideData {
    categories: SalaryCategory[];
    insights: SalaryInsight[];
}

export const salaryGuideService = {
    getSalaryData: async (): Promise<SalaryGuideData> => {
        const response = await api.get('/salary-guide');
        return response.data;
    },

    // Admin methods
    createCategory: async (data: { name: string; order?: number }) => {
        const response = await api.post('/salary-guide/categories', data);
        return response.data;
    },

    updateCategory: async (id: string, data: { name?: string; order?: number }) => {
        const response = await api.patch(`/salary-guide/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete(`/salary-guide/categories/${id}`);
        return response.data;
    },

    createRole: async (data: {
        title: string;
        range: string;
        experience: string;
        categoryId: string;
    }) => {
        const response = await api.post('/salary-guide/roles', data);
        return response.data;
    },

    updateRole: async (
        id: string,
        data: { title?: string; range?: string; experience?: string },
    ) => {
        const response = await api.patch(`/salary-guide/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string) => {
        const response = await api.delete(`/salary-guide/roles/${id}`);
        return response.data;
    },

    createInsight: async (data: {
        icon: string;
        title: string;
        description: string;
        color: string;
        bg: string;
        order?: number;
    }) => {
        const response = await api.post('/salary-guide/insights', data);
        return response.data;
    },

    updateInsight: async (
        id: string,
        data: {
            icon?: string;
            title?: string;
            description?: string;
            color?: string;
            bg?: string;
            order?: number;
        },
    ) => {
        const response = await api.patch(`/salary-guide/insights/${id}`, data);
        return response.data;
    },

    deleteInsight: async (id: string) => {
        const response = await api.delete(`/salary-guide/insights/${id}`);
        return response.data;
    },
};
