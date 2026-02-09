"use client";

const WISHLIST_BASE_KEY = "khmerwork_wishlist";

const getWishlistKey = (): string => {
    if (typeof window === "undefined") return WISHLIST_BASE_KEY;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                return `${WISHLIST_BASE_KEY}_${user.id}`;
            }
        }
    } catch (error) {
        console.error("Error getting wishlist key:", error);
    }
    return WISHLIST_BASE_KEY;
};

// Helper to notify components about wishlist changes
const notifyWishlistChange = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wishlistUpdated"));
    }
};

export const wishlistService = {
    getSavedJobIds: (): string[] => {
        if (typeof window === "undefined") return [];
        const key = getWishlistKey();
        const saved = localStorage.getItem(key);
        if (!saved) return [];

        try {
            const ids = JSON.parse(saved);
            // Deduplicate and filter out invalid entries
            const uniqueIds = Array.from(new Set(ids.filter((id: any) => id != null && id !== "")));

            // Update localStorage if we found duplicates or invalid entries
            if (uniqueIds.length !== ids.length) {
                localStorage.setItem(key, JSON.stringify(uniqueIds));
            }

            return uniqueIds as string[];
        } catch (error) {
            console.error("Failed to parse wishlist:", error);
            return [];
        }
    },

    saveJob: (jobId: string) => {
        if (typeof window === "undefined") return;
        if (!jobId || jobId === "") return; // Prevent saving empty IDs

        const key = getWishlistKey();
        const saved = wishlistService.getSavedJobIds();
        const jobIdStr = String(jobId); // Ensure it's a string

        if (!saved.includes(jobIdStr)) {
            const updated = [...saved, jobIdStr];
            localStorage.setItem(key, JSON.stringify(updated));
            notifyWishlistChange();
        }
    },

    removeJob: (jobId: string) => {
        if (typeof window === "undefined") return;
        const key = getWishlistKey();
        const saved = wishlistService.getSavedJobIds();
        const jobIdStr = String(jobId);
        const updated = saved.filter(id => id !== jobIdStr);

        if (updated.length !== saved.length) {
            localStorage.setItem(key, JSON.stringify(updated));
            notifyWishlistChange();
        }
    },

    isJobSaved: (jobId: string): boolean => {
        const saved = wishlistService.getSavedJobIds();
        return saved.includes(String(jobId));
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
    },

    // Utility to clean up the wishlist
    clearAll: () => {
        if (typeof window === "undefined") return;
        const key = getWishlistKey();
        localStorage.removeItem(key);
        notifyWishlistChange();
    }
};

