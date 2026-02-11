
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
    async register(role: 'Employer' | 'Freelancer', fullName: string, email: string, pass: string) {
        await this.navigateTo('/register');
        await this.waitForLoadingFinished();

        await this.page.click(`button:has-text("${role}")`);
        await this.page.fill('input[name="fullname"]', fullName);
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="password"]', pass);
        await this.page.click('button[type="submit"]');

        await this.waitForLoadingFinished();
        await this.page.waitForSelector('text=Welcome Aboard!', { timeout: 15000 });
    }

    async isRegistrationSuccessful() {
        return this.page.locator('text=Welcome Aboard!').isVisible({ timeout: 10000 });
    }

    async hasConflictError() {
        return this.page.locator('text=Email already exists').isVisible({ timeout: 5000 });
    }
}
