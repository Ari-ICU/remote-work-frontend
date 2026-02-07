
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class JobPage extends BasePage {
    async postJob(details: {
        title: string;
        category: string;
        company: string;
        location: string;
        type: string;
        salary: string;
        description: string;
    }) {
        await this.navigateTo('/post-job');
        await this.page.fill('input[name="title"]', details.title);

        await this.page.click('button:has-text("Select talent area")');
        await this.page.click(`div[role="option"]:has-text("${details.category}")`);

        await this.page.fill('input[name="company"]', details.company);
        await this.page.fill('input[name="location"]', details.location);

        await this.page.click('button:has-text("How will they work?")');
        await this.page.click(`div[role="option"]:has-text("${details.type}")`);

        await this.page.fill('input[name="salary"]', details.salary);
        await this.page.fill('textarea[name="description"]', details.description);
        await this.page.click('button[type="submit"]');

        await expect(this.page.locator('h1')).toContainText('Listing Published!', { timeout: 15000 });
    }

    async searchAndSelectJob(title: string) {
        await this.navigateTo('/jobs');

        for (let i = 0; i < 5; i++) {
            const jobCard = this.page.locator('article').filter({ hasText: title }).first();
            const applyLink = jobCard.getByRole('link', { name: /Apply Now/i });

            if (await applyLink.isVisible()) {
                await applyLink.click();
                return true;
            }

            if (i < 4) {
                await this.page.reload();
                await this.page.waitForTimeout(2000);
            }
        }
        return false;
    }

    async applyToJob(applicant: {
        fullName: string;
        email: string;
        phone: string;
        coverLetter: string;
        proposedRate: string;
        estimatedTime: string;
        resumePath: string;
    }) {
        await this.page.fill('input[name="fullname"]', applicant.fullName);
        await this.page.fill('input[name="email"]', applicant.email);
        await this.page.fill('input[name="phone"]', applicant.phone);
        await this.page.fill('textarea[name="coverLetter"]', applicant.coverLetter);
        await this.page.fill('input[name="proposedRate"]', applicant.proposedRate);
        await this.page.fill('input[name="estimatedTime"]', applicant.estimatedTime);
        await this.page.setInputFiles('input[type="file"]', applicant.resumePath);
        await this.page.click('button[type="submit"]');

        await expect(this.page.locator('text=Application Sent!')).toBeVisible({ timeout: 10000 });
    }
}
