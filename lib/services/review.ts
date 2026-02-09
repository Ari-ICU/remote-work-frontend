import api from '../api';
import { Review } from '@/types/user';

export const reviewService = {
    async createReview(data: { revieweeId: string; rating: number; comment?: string }): Promise<Review> {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    async getUserReviews(userId: string): Promise<Review[]> {
        const response = await api.get(`/reviews/user/${userId}`);
        return response.data;
    },
};
