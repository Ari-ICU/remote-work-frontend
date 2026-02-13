type Listener = (loading: boolean) => void;

class LoadingStore {
    private activeRequests: number = 0;
    private listeners: Set<Listener> = new Set();
    private timeoutId: NodeJS.Timeout | null = null;

    getState() {
        return this.activeRequests > 0;
    }

    setIsLoading(loading: boolean) {
        if (loading) {
            this.activeRequests++;
        } else {
            this.activeRequests = Math.max(0, this.activeRequests - 1);
        }

        const isCurrentlyLoading = this.activeRequests > 0;

        // Clear any existing safety timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Set a safety timeout to stop loading if it gets stuck for 15 seconds
        if (isCurrentlyLoading) {
            this.timeoutId = setTimeout(() => {
                console.warn("Loading state stuck for 15 seconds, forcing stop.");
                this.activeRequests = 0;
                this.notify();
            }, 15000);
        }

        this.notify();
    }

    private notify() {
        const state = this.getState();
        this.listeners.forEach(listener => listener(state));
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export const loadingStore = new LoadingStore();
