import api from "@/lib/api";

export enum PaymentProvider {
    PAYPAL = 'PAYPAL',
    CARD = 'CARD',
    KHQR = 'KHQR'
}

export const paymentService = {
    createPaymentIntent: async (amount: number, currency: string = 'usd', provider: PaymentProvider = PaymentProvider.CARD) => {
        const { data } = await api.post('/payments/create-intent', { amount, currency, provider });
        return data;
    },

    connectPaymentMethod: async (provider: PaymentProvider, paymentDetails: any) => {
        const { data } = await api.post('/payments/connect-method', {
            provider,
            paymentDetails
        });
        return data;
    },

    disconnectPaymentMethod: async () => {
        const { data } = await api.delete('/payments/disconnect-method');
        return data;
    },

    getPaymentStatus: async () => {
        const { data } = await api.get('/payments/status');
        return data;
    },

    processPayment: async (amount: number, currency: string, provider: PaymentProvider, jobId?: string) => {
        const { data } = await api.post('/payments/process', {
            amount,
            currency,
            provider,
            jobId
        });
        return data;
    }
};
