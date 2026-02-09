import { test, expect } from '@playwright/test';

test.describe('Wishlist Functionality', () => {
    const WISHLIST_KEY = 'khmerwork_wishlist';

    test.beforeEach(async ({ page }) => {
        // Clear wishlist before each test
        await page.goto('http://localhost:3002');
        await page.evaluate((key) => {
            localStorage.removeItem(key);
        }, WISHLIST_KEY);
        await page.reload();
    });

    test('should show initial wishlist count as 0', async ({ page }) => {
        await page.goto('http://localhost:3002');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check that the saved jobs badge is not visible (count is 0)
        const savedJobsButton = page.locator('a[href="/jobs/saved"]').first();
        await expect(savedJobsButton).toBeVisible();

        // Badge should not exist when count is 0
        const badge = savedJobsButton.locator('span.bg-primary');
        await expect(badge).not.toBeVisible();
    });

    test('should increment wishlist count when saving a job', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Wait for job cards to load
        await page.waitForSelector('article', { timeout: 10000 });

        // Find and click the first bookmark button
        const firstBookmarkButton = page.locator('button[aria-label*="Save job"]').first();
        await firstBookmarkButton.waitFor({ state: 'visible' });
        await firstBookmarkButton.click();

        // Wait a bit for the event to propagate
        await page.waitForTimeout(500);

        // Check that the badge now shows "1"
        const savedJobsButton = page.locator('a[href="/jobs/saved"]').first();
        const badge = savedJobsButton.locator('span.bg-primary');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText('1');

        // Verify localStorage
        const savedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(savedIds).toHaveLength(1);
        console.log('Saved job IDs:', savedIds);
    });

    test('should increment count when saving multiple jobs', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Wait for job cards to load
        await page.waitForSelector('article', { timeout: 10000 });

        // Save 3 jobs
        const bookmarkButtons = page.locator('button[aria-label*="Save job"]');
        const count = await bookmarkButtons.count();
        const jobsToSave = Math.min(3, count);

        for (let i = 0; i < jobsToSave; i++) {
            await bookmarkButtons.nth(i).click();
            await page.waitForTimeout(300);
        }

        // Check that the badge shows the correct count
        const savedJobsButton = page.locator('a[href="/jobs/saved"]').first();
        const badge = savedJobsButton.locator('span.bg-primary');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText(String(jobsToSave));

        // Verify localStorage has correct number of unique IDs
        const savedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(savedIds).toHaveLength(jobsToSave);

        // Verify no duplicates
        const uniqueIds = Array.from(new Set(savedIds));
        expect(uniqueIds).toHaveLength(jobsToSave);
    });

    test('should decrement count when removing a job', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Wait for job cards
        await page.waitForSelector('article', { timeout: 10000 });

        // Save 2 jobs
        const bookmarkButtons = page.locator('button[aria-label*="Save job"]');
        await bookmarkButtons.nth(0).click();
        await page.waitForTimeout(300);
        await bookmarkButtons.nth(1).click();
        await page.waitForTimeout(300);

        // Verify count is 2
        let badge = page.locator('a[href="/jobs/saved"]').first().locator('span.bg-primary');
        await expect(badge).toHaveText('2');

        // Remove one job (click the same button to unsave)
        await bookmarkButtons.nth(0).click();
        await page.waitForTimeout(300);

        // Verify count is now 1
        await expect(badge).toHaveText('1');

        // Verify localStorage
        const savedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        expect(savedIds).toHaveLength(1);
    });

    test('should show count as "9+" when more than 9 jobs saved', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Manually set localStorage with 10 job IDs
        await page.evaluate((key) => {
            const mockIds = Array.from({ length: 10 }, (_, i) => String(i + 1));
            localStorage.setItem(key, JSON.stringify(mockIds));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }, WISHLIST_KEY);

        await page.waitForTimeout(500);

        // Check that badge shows "9+"
        const badge = page.locator('a[href="/jobs/saved"]').first().locator('span.bg-primary');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText('9+');
    });

    test('should persist count across page navigation', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Save a job
        await page.waitForSelector('article', { timeout: 10000 });
        const bookmarkButton = page.locator('button[aria-label*="Save job"]').first();
        await bookmarkButton.click();
        await page.waitForTimeout(300);

        // Navigate to jobs page
        await page.goto('http://localhost:3002/jobs');
        await page.waitForLoadState('networkidle');

        // Verify count is still visible
        const badge = page.locator('a[href="/jobs/saved"]').first().locator('span.bg-primary');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText('1');
    });

    test('should navigate to saved jobs page and show correct jobs', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Save 2 jobs
        await page.waitForSelector('article', { timeout: 10000 });
        const bookmarkButtons = page.locator('button[aria-label*="Save job"]');
        await bookmarkButtons.nth(0).click();
        await page.waitForTimeout(300);
        await bookmarkButtons.nth(1).click();
        await page.waitForTimeout(300);

        // Click on saved jobs link
        await page.locator('a[href="/jobs/saved"]').first().click();
        await page.waitForLoadState('networkidle');

        // Verify we're on the saved jobs page
        await expect(page).toHaveURL(/\/jobs\/saved/);

        // Verify the page shows 2 jobs
        const savedJobCards = page.locator('article, div[class*="group relative"]').filter({
            has: page.locator('h3')
        });

        // Wait for jobs to load
        await page.waitForTimeout(1000);

        const count = await savedJobCards.count();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    test('should prevent duplicate job IDs in localStorage', async ({ page }) => {
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Wait for job cards
        await page.waitForSelector('article', { timeout: 10000 });

        // Click the same bookmark button multiple times
        const bookmarkButton = page.locator('button[aria-label*="Save job"]').first();
        await bookmarkButton.click();
        await page.waitForTimeout(200);
        await bookmarkButton.click(); // Unsave
        await page.waitForTimeout(200);
        await bookmarkButton.click(); // Save again
        await page.waitForTimeout(200);

        // Verify localStorage has no duplicates
        const savedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        const uniqueIds = Array.from(new Set(savedIds));
        expect(savedIds).toEqual(uniqueIds);
        expect(savedIds).toHaveLength(1);
    });

    test('should auto-clean corrupted localStorage data', async ({ page }) => {
        await page.goto('http://localhost:3002');

        // Set corrupted data with duplicates and invalid entries
        await page.evaluate((key) => {
            const corruptedData = ['1', '2', '1', null, '', '3', '2'];
            localStorage.setItem(key, JSON.stringify(corruptedData));
        }, WISHLIST_KEY);

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify the data was auto-cleaned
        const cleanedIds = await page.evaluate((key) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }, WISHLIST_KEY);

        // Should only have unique, valid IDs
        expect(cleanedIds).toEqual(['1', '2', '3']);

        // Badge should show correct count
        const badge = page.locator('a[href="/jobs/saved"]').first().locator('span.bg-primary');
        await expect(badge).toHaveText('3');
    });

    test('should update count in mobile menu', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('http://localhost:3002');
        await page.waitForLoadState('networkidle');

        // Save a job
        await page.waitForSelector('article', { timeout: 10000 });
        const bookmarkButton = page.locator('button[aria-label*="Save job"]').first();
        await bookmarkButton.click();
        await page.waitForTimeout(300);

        // Open mobile menu
        const menuButton = page.locator('button[aria-label="Toggle menu"]');
        await menuButton.click();
        await page.waitForTimeout(300);

        // Check mobile menu shows count
        const mobileMenuItem = page.locator('a[href="/jobs/saved"]').last();
        const mobileBadge = mobileMenuItem.locator('span.bg-primary');
        await expect(mobileBadge).toBeVisible();
        await expect(mobileBadge).toHaveText('1');
    });
});
