
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class DashboardPage extends BasePage {
    async verifyAppliedJob(jobTitle: string) {
        await this.navigateTo('/dashboard');
        await expect(this.page.locator('text=Applied Jobs')).toBeVisible();
        await expect(this.page.locator(`text=${jobTitle}`)).toBeVisible();
        await expect(this.page.getByText('PENDING')).toBeVisible();
    }

    async openJobApplications(jobTitle: string) {
        await this.navigateTo('/dashboard');

        // Debug: Check if we are on dashboard or redirect
        if (await this.page.url().includes('login')) {
            console.log('Redirected to login page. Session might be lost.');
            // Re-login logic should be handled by the test, but good to know.
        }

        try {
            await expect(this.page.locator(`text=${jobTitle}`)).toBeVisible({ timeout: 10000 });
        } catch (e) {
            console.log(`Job title "${jobTitle}" not found on dashboard.`);
            const bodyHtml = await this.page.innerHTML('body');
            console.log('Page HTML snippet:', bodyHtml.substring(0, 1000));

            if (await this.page.locator('text=You haven\'t posted any jobs yet').isVisible()) {
                console.log('Dashboard shows "You haven\'t posted any jobs yet".');
            }
            throw e;
        }

        // Improved selector to find the specific "View Applicants" button for this job
        // Navigate up from the title to find the container, then find the button
        // Based on DOM: text=Title -> parent -> parent -> sibling -> Link -> Button
        // Or simpler: row contains title and button.
        // We can use a locator that filters by having the title.
        const jobCard = this.page.locator('div.p-6').filter({ hasText: jobTitle }).first();
        const viewApplicantsBtn = jobCard.locator('a[href*="/applications"]');

        await viewApplicantsBtn.click();
    }

    async verifyApplicantExists(name: string) {
        await expect(this.page.getByText(name)).toBeVisible({ timeout: 5000 });
    }
}
