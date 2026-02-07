
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
    async loginAsAdmin(email: string, pass: string) {
        await this.navigateTo('/login?redirect=/admin');
        await this.page.fill('input[type="email"]', email);
        await this.page.fill('input[type="password"]', pass);
        await this.page.click('button[type="submit"]');
        await this.page.waitForURL(url =>
            url.pathname.includes('/dashboard') ||
            url.pathname.includes('/admin') ||
            url.pathname === '/',
            { timeout: 15000 }
        );
    }

    async goToUsers() {
        await this.page.click('a[href="/admin/users"]');
        await this.page.waitForSelector('h1:has-text("User Management")');
    }

    async goToJobs() {
        await this.page.click('a[href="/admin/jobs"]');
        await this.page.waitForSelector('h1:has-text("Market Intelligence")');
    }

    async goToApplications() {
        await this.page.click('a[href="/admin/applications"]');
        await this.page.waitForSelector('h1:has-text("Application Protocol")');
    }

    async addUser(userData: { firstName: string, lastName: string, email: string, role: string }) {
        await this.page.click('button:has-text("Add New User")');
        await this.page.fill('input#firstName', userData.firstName);
        await this.page.fill('input#lastName', userData.lastName);
        await this.page.fill('input#email', userData.email);
        await this.page.fill('input#password', 'password123'); // Password is required for new users

        // Select role using Radix Select
        const trigger = this.page.locator('button[role="combobox"]');
        await trigger.click();
        await this.page.locator('role=option', { hasText: userData.role === 'EMPLOYER' ? 'Employer' : userData.role === 'ADMIN' ? 'Admin' : 'Freelancer' }).click();

        await this.page.click('button:has-text("Create User")');
        await this.page.waitForSelector('text=User created successfully');
    }

    async searchUser(query: string) {
        await this.page.fill('input[placeholder*="Find user"]', query);
        await this.page.waitForTimeout(1000); // Wait for debounce
    }

    async deleteUser(email: string) {
        const row = this.page.locator(`tr:has-text("${email}")`);
        await row.locator('button:has(svg.lucide-more-vertical)').click();

        // Listen for dialog
        this.page.once('dialog', dialog => dialog.accept());

        await this.page.click('span:has-text("Terminate Identity")');
        await this.page.waitForSelector('text=Identity purged from ecosystem');
    }

    async updateJobStatus(jobTitle: string, status: 'Approve' | 'Reject') {
        const row = this.page.locator(`tr:has-text("${jobTitle}")`);
        await row.locator('button:has(svg.lucide-more-vertical)').click();
        await this.page.click(`span:has-text("${status} Mission")`);
        await this.page.waitForSelector('text=Job protocol updated');
    }

    async updateApplicationStatus(applicantName: string, status: 'Accept' | 'Reject') {
        const row = this.page.locator(`tr:has-text("${applicantName}")`);
        await row.locator('button:has(svg.lucide-more-vertical)').click();
        await this.page.click(`button:has-text("${status}")`);
        await this.page.waitForSelector('text=Application status updated');
    }

    async triggerCleanup() {
        return await this.page.evaluate(async () => {
            const apiUrl = (window as any).NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/admin/cleanup-test-data`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            return response.json();
        });
    }
}
