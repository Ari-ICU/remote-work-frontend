
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    async login(email: string, pass: string) {
        await this.navigateTo('/login');
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="password"]', pass);
        await this.page.click('button[type="submit"]');
        await this.page.waitForURL('**/', { timeout: 15000 });
    }
}
