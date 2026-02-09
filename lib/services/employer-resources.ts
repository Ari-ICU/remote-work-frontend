import api from '../api';

export interface EmployerResourceCategory {
    id: string;
    icon: string;
    title: string;
    description: string;
    resources: string[];
    color: string;
    bg: string;
    order: number;
}

export interface EmployerFeaturedGuide {
    id: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    icon: string;
    color: string;
    order: number;
}

export interface EmployerDownloadableResource {
    id: string;
    title: string;
    description: string;
    format: string;
    size: string;
    order: number;
}

export interface EmployerFAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
}

export const employerResourcesService = {
    async getCategories(): Promise<EmployerResourceCategory[]> {
        const response = await api.get('/employer-resources/categories');
        return response.data;
    },

    async getGuides(): Promise<EmployerFeaturedGuide[]> {
        const response = await api.get('/employer-resources/guides');
        return response.data;
    },

    async getDownloads(): Promise<EmployerDownloadableResource[]> {
        const response = await api.get('/employer-resources/downloads');
        return response.data;
    },

    async getFaqs(): Promise<EmployerFAQ[]> {
        const response = await api.get('/employer-resources/faqs');
        return response.data;
    },

    // Admin methods - Categories
    async createCategory(data: Partial<EmployerResourceCategory>) {
        const response = await api.post('/employer-resources/categories', data);
        return response.data;
    },
    async updateCategory(id: string, data: Partial<EmployerResourceCategory>) {
        const response = await api.put(`/employer-resources/categories/${id}`, data);
        return response.data;
    },
    async deleteCategory(id: string) {
        const response = await api.delete(`/employer-resources/categories/${id}`);
        return response.data;
    },

    // Admin methods - Guides
    async createGuide(data: Partial<EmployerFeaturedGuide>) {
        const response = await api.post('/employer-resources/guides', data);
        return response.data;
    },
    async updateGuide(id: string, data: Partial<EmployerFeaturedGuide>) {
        const response = await api.put(`/employer-resources/guides/${id}`, data);
        return response.data;
    },
    async deleteGuide(id: string) {
        const response = await api.delete(`/employer-resources/guides/${id}`);
        return response.data;
    },

    // Admin methods - Downloads
    async createDownload(data: Partial<EmployerDownloadableResource>) {
        const response = await api.post('/employer-resources/downloads', data);
        return response.data;
    },
    async updateDownload(id: string, data: Partial<EmployerDownloadableResource>) {
        const response = await api.put(`/employer-resources/downloads/${id}`, data);
        return response.data;
    },
    async deleteDownload(id: string) {
        const response = await api.delete(`/employer-resources/downloads/${id}`);
        return response.data;
    },

    // Admin methods - FAQs
    async createFaq(data: Partial<EmployerFAQ>) {
        const response = await api.post('/employer-resources/faqs', data);
        return response.data;
    },
    async updateFaq(id: string, data: Partial<EmployerFAQ>) {
        const response = await api.put(`/employer-resources/faqs/${id}`, data);
        return response.data;
    },
    async deleteFaq(id: string) {
        const response = await api.delete(`/employer-resources/faqs/${id}`);
        return response.data;
    },
};
