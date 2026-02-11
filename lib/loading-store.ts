type Listener = (loading: boolean) => void;

class LoadingStore {
    private isLoading: boolean = false;
    private listeners: Set<Listener> = new Set();
    private timeoutId: NodeJS.Timeout | null = null;

    getState() {
        return this.isLoading;
    }

    setIsLoading(loading: boolean) {
        this.isLoading = loading;

        // Clear any existing safety timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Set a safety timeout to stop loading after 10 seconds
        if (loading) {
            this.timeoutId = setTimeout(() => {
                this.setIsLoading(false);
            }, 10000);
        }

        this.listeners.forEach(listener => listener(this.isLoading));
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export const loadingStore = new LoadingStore();
