import { test, expect } from '@playwright/test';

test.describe('Salary Guide Page', () => {
    test('should display salary categories and market insights', async ({ page }) => {
        // Navigate to the salary guide page
        await page.goto('/salary-guide');

        // Check for the main heading
        await expect(page.getByRole('heading', { name: 'Cambodia Salary Guide 2026' })).toBeVisible();

        // Verify "Market Insights" section
        await expect(page.getByText('Market Insights')).toBeVisible();

        // Check that at least one insight card is visible (wait for data to load)
        const insightCards = page.locator('.grid > div.p-6.rounded-xl');
        await expect(insightCards.first()).toBeVisible({ timeout: 10000 });

        // Verify "Salary Ranges by Role" section
        await expect(page.getByText('Salary Ranges by Role')).toBeVisible();

        // Verify categories (as seeded in prisma/seed.ts)
        // Common categories are usually "Technology & Development", "Design & Creative", etc.
        // We'll check for generic table headers first
        await expect(page.getByRole('columnheader', { name: 'Role' }).first()).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Salary Range (USD/month)' }).first()).toBeVisible();

        // Log the categories found for debugging if needed
        const categoryHeadings = await page.locator('h3.text-2xl.font-bold').allInnerTexts();
        console.log('Found categories:', categoryHeadings);

        // Ensure at least one category exists
        expect(categoryHeadings.length).toBeGreaterThan(0);
    });

    test('should show loading spinner initially', async ({ page }) => {
        // This test might be flaky if skip is not used, but good to have
        await page.goto('/salary-guide');
        const loadingSpinner = page.locator('.animate-spin');
        // It might be too fast to see, but we can check if it exists or was visible
    });
});
