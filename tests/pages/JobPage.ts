
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
        skills?: string;
        description: string;
    }) {
        await this.navigateTo('/post-job');
        await this.waitForLoadingFinished();

        await this.page.fill('input[name="title"]', details.title);

        await this.page.click('button[data-slot="select-trigger"]:has-text("Select talent area"), button[role="combobox"]:has-text("Select talent area")');
        await this.page.click(`div[role="option"]:has-text("${details.category}")`);

        await this.page.fill('input[name="company"]', details.company);
        await this.page.fill('input[name="location"]', details.location);

        // Select Type (Buttons)
        await this.page.click(`button:has-text("${details.type}")`);

        await this.page.fill('input[name="salary"]', details.salary);
        await this.page.fill('input[name="skills"]', details.skills || 'React, Node.js');
        await this.page.fill('textarea[name="description"]', details.description);
        await this.page.click('button[type="submit"]');

        await this.waitForLoadingFinished();
        await expect(this.page.locator('h1')).toContainText('Listing Published!', { timeout: 15000 });
    }

    async searchAndSelectJob(title: string) {
        await this.navigateTo('/jobs');
        await this.waitForLoadingFinished();

        for (let i = 0; i < 5; i++) {

            try {
                // Wait for grid or list to appear
                await this.page.waitForSelector('article', { timeout: 10000 });
            } catch (e) {
                console.log('No articles found, reloading...');
            }

            // Get all articles (job cards)
            const count = await this.page.locator('article').count();

            for (let j = 0; j < count; j++) {
                const card = this.page.locator('article').nth(j);
                if (await card.innerText().then(t => t.includes(title))) {
                    const link = card.locator('a[href^="/jobs/"]');
                    await link.click();
                    await this.waitForLoadingFinished(); // Wait for job details to load
                    return true;
                }
            }

            if (i < 4) {
                console.log(`Job ${title} not found, reloading... (${i + 1}/5)`);
                await this.page.reload();
                await this.waitForLoadingFinished();
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
        await this.page.fill('input#fullname', applicant.fullName);
        await this.page.fill('input#email', applicant.email);
        await this.page.fill('input#phone', applicant.phone);
        await this.page.fill('textarea#coverLetter', applicant.coverLetter);
        await this.page.fill('input#proposedRate', applicant.proposedRate);
        await this.page.fill('input#estimatedTime', applicant.estimatedTime);
        await this.page.setInputFiles('input[type="file"]', applicant.resumePath);
        await this.page.click('button[type="submit"]');

        await this.waitForLoadingFinished();
        await expect(this.page.locator('text=Application Sent!')).toBeVisible({ timeout: 10000 });
    }
}
