"use client";

const WISHLIST_KEY = "khmerwork_wishlist";

export const wishlistService = {
    getSavedJobIds: (): string[] => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem(WISHLIST_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    saveJob: (jobId: string) => {
        if (typeof window === "undefined") return;
        const saved = wishlistService.getSavedJobIds();
        if (!saved.includes(jobId)) {
            const updated = [...saved, jobId];
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        }
    },

    removeJob: (jobId: string) => {
        if (typeof window === "undefined") return;
        const saved = wishlistService.getSavedJobIds();
        const updated = saved.filter(id => id !== jobId);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    },

    isJobSaved: (jobId: string): boolean => {
        const saved = wishlistService.getSavedJobIds();
        return saved.includes(jobId);
    },

    toggleJob: (jobId: string): boolean => {
        const isSaved = wishlistService.isJobSaved(jobId);
        if (isSaved) {
            wishlistService.removeJob(jobId);
            return false;
        } else {
            wishlistService.saveJob(jobId);
            return true;
        }
    }
};
