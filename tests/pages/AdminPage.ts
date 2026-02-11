
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
        await this.waitForLoadingFinished();
    }

    async goToUsers() {
        console.log('Navigating to Admin Users...');
        await this.waitForLoadingFinished();
        await Promise.all([
            this.page.waitForURL(/\/admin\/users/),
            this.page.locator('aside').getByRole('link', { name: 'Users' }).click({ force: true })
        ]);
        await this.waitForLoadingFinished();
        await this.page.waitForSelector('h1:has-text("User Management")');
        console.log('Reached User Management.');
    }

    async goToJobs() {
        console.log('Navigating to Admin Jobs...');
        await this.waitForLoadingFinished();
        await Promise.all([
            this.page.waitForURL(/\/admin\/jobs/),
            this.page.locator('aside').getByRole('link', { name: 'Jobs' }).click({ force: true })
        ]);
        await this.waitForLoadingFinished();
        await this.page.waitForSelector('h1:has-text("Market Intelligence")');
        console.log('Reached Job Management.');
    }

    async goToApplications() {
        console.log('Navigating to Admin Applications...');
        await this.waitForLoadingFinished();
        await Promise.all([
            this.page.waitForURL(/\/admin\/applications/),
            this.page.locator('aside').getByRole('link', { name: 'Applications' }).click({ force: true })
        ]);
        await this.waitForLoadingFinished();
        await this.page.waitForSelector('h1:has-text("Application Protocol")');
        console.log('Reached Application Protocol.');
    }

    async addUser(userData: { firstName: string, lastName: string, email: string, role: string }) {
        console.log(`Adding user: ${userData.email}`);
        const addBtn = this.page.locator('button:has-text("Add New User")');
        await addBtn.waitFor({ state: 'visible' });
        await addBtn.click({ force: true });

        await this.page.waitForSelector('text=Create New User');
        await this.page.locator('input#firstName').waitFor({ state: 'visible' });
        await this.page.fill('input#firstName', userData.firstName);

        await this.page.locator('input#lastName').waitFor({ state: 'visible' });
        await this.page.fill('input#lastName', userData.lastName);

        await this.page.locator('input#email').waitFor({ state: 'visible' });
        await this.page.fill('input#email', userData.email);

        await this.page.locator('input#password').waitFor({ state: 'visible' });
        await this.page.fill('input#password', 'Password123!');

        console.log(`Selecting role: ${userData.role}`);
        const dialog = this.page.locator('div[role="dialog"]');
        if (userData.role !== 'FREELANCER') {
            const trigger = dialog.locator('button[role="combobox"], [data-slot="select-trigger"]').first();
            await trigger.click();

            const roleLabel = userData.role === 'EMPLOYER' ? 'Employer' : 'Admin';
            const option = this.page.locator(`div[role="option"]`).filter({ hasText: roleLabel }).first();
            await option.waitFor({ state: 'visible' });
            await option.click();
            await this.page.waitForTimeout(500);
        } else {
            console.log('Role is FREELANCER (default or current), skipping selection.');
        }

        console.log('Submitting user form...');
        const submitBtn = dialog.locator('button:has-text("Create User")');
        await submitBtn.waitFor({ state: 'visible' });
        await submitBtn.click({ force: true });
        console.log('Submit button clicked.');

        // Wait for success toast first as it appears immediately
        await this.page.waitForSelector('text=User created successfully', { state: 'visible', timeout: 10000 });
        console.log('Success toast appeared.');

        // Attempt to close dialog if it's still open (sometimes state update is slow or stuck)
        try {
            await this.page.waitForSelector('text=Create New User', { state: 'hidden', timeout: 2000 });
        } catch (e) {
            console.log('Dialog still visible, pressing Escape...');
            await this.page.keyboard.press('Escape');
        }

        await this.page.waitForSelector('text=Create New User', { state: 'hidden', timeout: 30000 });
        console.log('User creation dialog closed.');
    }

    async searchUser(query: string) {
        // Trigger search and wait for the API response to ensure the table updates
        const responsePromise = this.page.waitForResponse(resp =>
            resp.url().includes('/admin/users') && resp.status() === 200
        );
        await this.page.fill('input[placeholder*="Find user"]', query);
        await responsePromise;
        await this.page.waitForTimeout(500); // Small buffer for React render cycle
    }

    async deleteUser(email: string) {
        console.log(`Searching for user to delete: ${email}`);

        const row = this.page.locator(`tr:has-text("${email}")`).first();
        if (!await row.isVisible()) {
            await this.searchUser(email);
        }
        await row.waitFor({ state: 'visible' });

        console.log('Opening action menu...');
        const menuBtn = row.locator('button').filter({ has: this.page.locator('svg') }).last();
        await menuBtn.click({ force: true });

        // Listen for native confirm dialog
        console.log('Intercepting confirm dialog...');
        this.page.once('dialog', async dialog => {
            console.log(`Accepted dialog: ${dialog.message()}`);
            await dialog.accept();
        });

        console.log('Clicking Terminate Identity...');
        await this.page.click('span:has-text("Terminate Identity"), [role="menuitem"]:has-text("Terminate Identity")');

        // Wait for the row to disappear (best indicator of success)
        console.log(`Waiting for row with ${email} to disappear...`);
        try {
            await row.waitFor({ state: 'hidden', timeout: 10000 });
            console.log('Row disappeared.');
        } catch (e) {
            console.log('Row did not disappear within 10s, checking for success toast...');
            await this.page.waitForSelector('text=Identity purged from ecosystem', { timeout: 10000 });
        }
        console.log('User deleted successfully.');
    }

    async updateJobStatus(jobTitle: string, status: 'Approve' | 'Reject') {
        const row = this.page.locator(`tr:has-text("${jobTitle}")`).first();
        try {
            await row.waitFor({ state: 'visible', timeout: 10000 });
        } catch (e) {
            console.log(`Failed to find row for job: ${jobTitle}. Current rows:`);
            const rows = await this.page.locator('tbody tr').allInnerTexts();
            console.log(rows.join('\n'));
            throw e;
        }
        console.log(`Updating job status to ${status} for: ${jobTitle}`);

        const menuBtn = row.locator('button').filter({ has: this.page.locator('svg') }).last();

        // Retry logic for opening menu
        const itemLabel = status === 'Approve' ? 'Approve Mission' : 'Reject Mission';
        const item = this.page.locator(`[role="menuitem"]:has-text("${itemLabel}")`);

        let menuOpened = false;
        for (let i = 0; i < 3; i++) {
            await menuBtn.click({ force: true });
            try {
                await item.waitFor({ state: 'visible', timeout: 2000 });
                menuOpened = true;
                break;
            } catch (e) {
                console.log('Menu item not visible, retrying click...');
            }
        }

        if (!menuOpened) {
            throw new Error(`Menu failed to open for job: ${jobTitle}`);
        }

        console.log(`Menu item visible: ${itemLabel}, clicking...`);
        await item.click({ force: true });

        try {
            await Promise.race([
                this.page.waitForSelector('text=Job protocol updated', { timeout: 5000 }),
                this.page.waitForSelector('text=Moderation command failed', { timeout: 5000 })
            ]);
            console.log('Job status update processed.');
        } catch (e) {
            console.log('Warning: Toast confirmation missed or delayed.');
        }
    }

    async updateApplicationStatus(applicantName: string, status: 'Accept' | 'Reject') {
        const row = this.page.locator(`tr:has-text("${applicantName}")`).first();
        try {
            await row.waitFor({ state: 'visible', timeout: 10000 });
        } catch (e) {
            console.log(`Failed to find row for applicant: ${applicantName}. Current rows:`);
            const rows = await this.page.locator('tbody tr').allInnerTexts();
            console.log(rows.join('\n'));
            throw e;
        }
        console.log(`Updating application status to ${status} for: ${applicantName}`);

        const menuBtn = row.locator('button').filter({ has: this.page.locator('svg') }).last();

        // Retry logic for opening menu
        const item = this.page.locator(`[role="menuitem"]:has-text("${status}")`);

        let menuOpened = false;
        for (let i = 0; i < 3; i++) {
            await menuBtn.click({ force: true });
            try {
                await item.waitFor({ state: 'visible', timeout: 2000 });
                menuOpened = true;
                break;
            } catch (e) {
                console.log('Menu item not visible, retrying click...');
            }
        }

        if (!menuOpened) {
            throw new Error(`Menu failed to open for applicant: ${applicantName}`);
        }

        console.log(`Menu item visible: ${status}, clicking...`);
        await item.click({ force: true });

        try {
            await Promise.race([
                this.page.waitForSelector('text=Application status updated', { timeout: 5000 }),
                this.page.waitForSelector('text=Moderation command failed', { timeout: 5000 })
            ]);
            console.log('Application status update processed.');
        } catch (e) {
            console.log('Warning: Toast confirmation missed or delayed.');
        }
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
