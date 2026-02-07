
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ProfilePage extends BasePage {
    async updateBasicInfo(firstName: string, lastName: string) {
        await this.navigateTo('/profile/edit');
        await this.page.fill('input[name="firstName"]', firstName);
        await this.page.fill('input[name="lastName"]', lastName);
        await this.page.click('button:has-text("Save Changes")');
        await this.page.waitForURL('**/profile');
    }

    async updateHeadlineAndBio(headline: string, bio: string) {
        await this.navigateTo('/profile/edit');
        await this.page.fill('input[name="headline"]', headline);
        await this.page.fill('textarea[name="bio"]', bio);
    }

    async addSkill(skill: string) {
        await this.page.getByRole('tab', { name: 'Skills & Langs' }).click();
        const skillInput = this.page.locator('input[placeholder="Type and press Enter..."]');
        await expect(skillInput).toBeVisible();
        await skillInput.fill(skill);
        await skillInput.press('Enter');
    }

    async saveChanges() {
        await this.page.click('button:has-text("Save Changes")');
        await this.page.waitForURL('**/profile');
    }

    async verifyHeadline(text: string) {
        await expect(this.page.locator(`text=${text}`)).toBeVisible();
    }
}
