
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class MessagingPage extends BasePage {
    async openChatWith(userName: string) {
        // Find conversation list item
        const conv = this.page.locator('div.cursor-pointer').filter({ hasText: userName }).first();
        try {
            await expect(conv).toBeVisible({ timeout: 15000 });
        } catch (e) {
            console.log(`Chat with ${userName} not found, reloading...`);
            await this.page.reload();
            await expect(conv).toBeVisible({ timeout: 15000 });
        }
        await conv.click();
    }

    async sendMessage(text: string) {
        const input = this.page.locator('textarea[placeholder="Type a message..."], input[placeholder="Type a message..."]');
        await input.fill(text);
        await input.press('Enter');
    }

    async verifyMessageReceived(text: string) {
        await expect(this.page.getByText(text).first()).toBeVisible({ timeout: 15000 });
    }
}
