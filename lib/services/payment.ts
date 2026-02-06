import api from "@/lib/api";

export const paymentService = {
    createPaymentIntent: async (amount: number, currency: string = 'usd') => {
        const { data } = await api.post('/payments/create-intent', { amount, currency });
        return data;
    }
};
