
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

        await this.page.click('button[data-slot="select-trigger"]:has-text("Select talent area"), button[role="combobox"]:has-text("Select talent area")');
        await this.page.click(`div[role="option"]:has-text("${details.category}")`);

        await this.page.fill('input[name="company"]', details.company);
        await this.page.fill('input[name="location"]', details.location);

        // Find the second combobox trigger (Type)
        const typeTrigger = this.page.locator('button[data-slot="select-trigger"], button[role="combobox"]').nth(1);
        await typeTrigger.click();
        await this.page.click(`div[role="option"]:has-text("${details.type}")`);

        await this.page.fill('input[name="salary"]', details.salary);
        await this.page.fill('textarea[name="description"]', details.description);
        await this.page.click('button[type="submit"]');

        await expect(this.page.locator('h1')).toContainText('Listing Published!', { timeout: 15000 });
    }

    async searchAndSelectJob(title: string) {
        await this.navigateTo('/jobs');

        for (let i = 0; i < 5; i++) {
            await this.page.waitForSelector('[data-testid="job-list-grid"]', { timeout: 10000 });

            for (let i = 0; i < 5; i++) {
                // Get all articles (job cards)
                const count = await this.page.locator('article').count();

                for (let j = 0; j < count; j++) {
                    const card = this.page.locator('article').nth(j);
                    if (await card.innerText().then(t => t.includes(title))) {
                        const link = card.locator('a[href^="/jobs/"]');
                        await link.click();
                        return true;
                    }
                }

                if (i < 4) {
                    await this.page.reload();
                    await this.page.waitForTimeout(2000);
                }
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
        await this.page.fill('input#fullname', applicant.fullName);
        await this.page.fill('input#email', applicant.email);
        await this.page.fill('input#phone', applicant.phone);
        await this.page.fill('textarea#coverLetter', applicant.coverLetter);
        await this.page.fill('input#proposedRate', applicant.proposedRate);
        await this.page.fill('input#estimatedTime', applicant.estimatedTime);
        await this.page.setInputFiles('input[type="file"]', applicant.resumePath);
        await this.page.click('button[type="submit"]');

        await expect(this.page.locator('text=Application Sent!')).toBeVisible({ timeout: 10000 });
    }
}
