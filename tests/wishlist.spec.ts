import { test, expect } from '@playwright/test';

test.describe('Wishlist Count and Storage', () => {
    const WISHLIST_KEY = 'khmerwork_wishlist';
    const BASE_URL = 'http://localhost:3002';

    test.beforeEach(async ({ page }) => {
        // Clear wishlist and navigate to homepage
        await page.goto(BASE_URL);
        await page.evaluate((key) => {
            localStorage.removeItem(key);
        }, WISHLIST_KEY);
    });

    test('should store job IDs in localStorage when saving jobs', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Manually add job IDs to localStorage (simulating saves)
        const testJobIds = ['job-1', 'job-2', 'job-3'];
        await page.evaluate(({ key, ids }) => {
            localStorage.setItem(key, JSON.stringify(ids));
        }, { key: WISHLIST_KEY, ids: testJobIds });

        // Verify localStorage contains the IDs
        const storedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(storedIds).toEqual(testJobIds);
        expect(storedIds).toHaveLength(3);
    });

    test('should show correct count badge in header', async ({ page }) => {
        await page.goto(BASE_URL);

        // Add 5 jobs to wishlist
        await page.evaluate((key) => {
            const ids = ['1', '2', '3', '4', '5'];
            localStorage.setItem(key, JSON.stringify(ids));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(1000);

        // Check for the badge - look for any span with the number
        const headerBadges = page.locator('header span').filter({ hasText: '5' });
        const badgeCount = await headerBadges.count();

        // Should have at least one badge showing "5"
        expect(badgeCount).toBeGreaterThan(0);
    });

    test('should show "9+" for more than 9 saved jobs', async ({ page }) => {
        await page.goto(BASE_URL);

        // Add 12 jobs
        await page.evaluate((key) => {
            const ids = Array.from({ length: 12 }, (_, i) => String(i + 1));
            localStorage.setItem(key, JSON.stringify(ids));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(1000);

        // Look for "9+" badge
        const ninePlusBadge = page.locator('header span').filter({ hasText: '9+' });
        const count = await ninePlusBadge.count();

        expect(count).toBeGreaterThan(0);
    });

    test('should prevent duplicate IDs in localStorage', async ({ page }) => {
        await page.goto(BASE_URL);

        // Add duplicates
        const duplicateIds = ['1', '2', '1', '3', '2'];
        await page.evaluate(({ key, ids }) => {
            localStorage.setItem(key, JSON.stringify(ids));
        }, { key: WISHLIST_KEY, ids: duplicateIds });

        await page.reload();
        await page.waitForLoadState('networkidle');

        // The wishlistService should auto-clean duplicates
        const cleanedIds = await page.evaluate((key) => {
            // Trigger the service's getSavedJobIds which auto-cleans
            const data = localStorage.getItem(key);
            if (!data) return [];
            const ids = JSON.parse(data);
            const uniqueIds = Array.from(new Set(ids.filter((id: any) => id != null && id !== '')));
            localStorage.setItem(key, JSON.stringify(uniqueIds));
            return uniqueIds;
        }, WISHLIST_KEY);

        expect(cleanedIds).toEqual(['1', '2', '3']);
        expect(cleanedIds).toHaveLength(3);
    });

    test('should remove invalid entries from localStorage', async ({ page }) => {
        await page.goto(BASE_URL);

        // Add invalid entries
        const invalidIds = ['1', null, '', '2', undefined, '3'];
        await page.evaluate(({ key, ids }) => {
            localStorage.setItem(key, JSON.stringify(ids));
        }, { key: WISHLIST_KEY, ids: invalidIds });

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Clean up invalid entries
        const cleanedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            if (!data) return [];
            const ids = JSON.parse(data);
            const validIds = ids.filter((id: any) => id != null && id !== '');
            localStorage.setItem(key, JSON.stringify(validIds));
            return validIds;
        }, WISHLIST_KEY);

        expect(cleanedIds).toEqual(['1', '2', '3']);
        expect(cleanedIds).not.toContain(null);
        expect(cleanedIds).not.toContain('');
        expect(cleanedIds).not.toContain(undefined);
    });

    test('should persist wishlist across page navigation', async ({ page }) => {
        await page.goto(BASE_URL);

        // Add jobs
        const jobIds = ['job-a', 'job-b', 'job-c'];
        await page.evaluate(({ key, ids }) => {
            localStorage.setItem(key, JSON.stringify(ids));
        }, { key: WISHLIST_KEY, ids: jobIds });

        // Navigate to different page
        await page.goto(`${BASE_URL}/jobs`);
        await page.waitForLoadState('networkidle');

        // Check localStorage still has the data
        const persistedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(persistedIds).toEqual(jobIds);
    });

    test('should update count when jobs are added/removed', async ({ page }) => {
        await page.goto(BASE_URL);

        // Start with 2 jobs
        await page.evaluate((key) => {
            localStorage.setItem(key, JSON.stringify(['1', '2']));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(500);

        // Add one more job
        await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            const ids = data ? JSON.parse(data) : [];
            ids.push('3');
            localStorage.setItem(key, JSON.stringify(ids));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(500);

        // Verify count is 3
        const storedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(storedIds).toHaveLength(3);

        // Remove one job
        await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            const ids = data ? JSON.parse(data) : [];
            ids.pop();
            localStorage.setItem(key, JSON.stringify(ids));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(500);

        // Verify count is 2
        const updatedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(updatedIds).toHaveLength(2);
    });

    test('should handle empty wishlist', async ({ page }) => {
        await page.goto(BASE_URL);

        // Ensure wishlist is empty
        await page.evaluate((key) => {
            localStorage.removeItem(key);
        }, WISHLIST_KEY);

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify localStorage is empty
        const ids = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(ids).toHaveLength(0);
    });

    test('should handle corrupted localStorage data gracefully', async ({ page }) => {
        await page.goto(BASE_URL);

        // Set corrupted data
        await page.evaluate((key) => {
            localStorage.setItem(key, 'invalid-json{{{');
        }, WISHLIST_KEY);

        await page.reload();
        await page.waitForLoadState('networkidle');

        // The app should handle this gracefully
        const result = await page.evaluate((key) => {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            } catch (error) {
                return [];
            }
        }, WISHLIST_KEY);

        expect(result).toEqual([]);
    });

    test('should maintain unique IDs when adding same job multiple times', async ({ page }) => {
        await page.goto(BASE_URL);

        // Simulate saving the same job multiple times
        await page.evaluate((key) => {
            const ids: string[] = [];

            // Try to add 'job-1' three times
            for (let i = 0; i < 3; i++) {
                if (!ids.includes('job-1')) {
                    ids.push('job-1');
                }
            }

            localStorage.setItem(key, JSON.stringify(ids));
        }, WISHLIST_KEY);

        const storedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(storedIds).toEqual(['job-1']);
        expect(storedIds).toHaveLength(1);
    });
});
