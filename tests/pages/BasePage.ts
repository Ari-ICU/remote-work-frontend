
import { Page, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;
    protected baseUrl: string = 'http://localhost:3000';

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(path: string) {
        await this.page.goto(`${this.baseUrl}${path}`);
    }

    async waitForLoadingFinished() {
        await expect(this.page.locator('.animate-spin')).not.toBeVisible({ timeout: 15000 });
    }

    async log(message: string) {
        const prefix = this.page.viewportSize()?.width && this.page.viewportSize()!.width > 1000 ? '[Browser]' : '[Mobile]';
        console.log(`${prefix}: ${message}`);
    }
}
