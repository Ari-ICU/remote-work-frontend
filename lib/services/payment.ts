import api from '../api';

export const paymentService = {
    createIntent: async (paymentData: any) => {
        const response = await api.post('/payments/create-intent', paymentData);
        return response.data;
    }
};
