
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
        await expect(this.page.locator(`text=${jobTitle}`)).toBeVisible({ timeout: 10000 });
        const viewApplicantsBtn = this.page.locator(`a[href*="/applications"]`).first();
        await viewApplicantsBtn.click();
    }

    async verifyApplicantExists(name: string) {
        await expect(this.page.getByText(name)).toBeVisible({ timeout: 5000 });
    }
}
