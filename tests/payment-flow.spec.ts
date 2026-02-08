
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { JobPage } from './pages/JobPage';

test.describe('Payment Flow Integration', () => {
    test.setTimeout(120000);

    const timestamp = Date.now();
    const employerEmail = `pay_test_${timestamp}@test.com`;
    const password = 'password123';

    test.beforeEach(async ({ page }) => {
        // Initial cleanup by admin
        const adminPage = new AdminPage(page);
        await adminPage.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPage.triggerCleanup();
    });

    test('Employer path: Pricing -> Checkout -> Post Job', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const pricingPage = new PricingPage(page);
        const checkoutPage = new CheckoutPage(page);

        // 1. Register as Employer
        await registerPage.register('Employer', 'Payment Tester', employerEmail, password);
        await page.waitForTimeout(2000); // Wait for session

        // 2. Go to Pricing
        await pricingPage.selectPlan('Featured');

        // 3. Complete Checkout (Card)
        await expect(page).toHaveURL(/.*checkout.*/);
        await checkoutPage.fillCardDetails({
            name: 'Payment Tester',
            cardNumber: '4242 4242 4242 4242',
            expiry: '12/25',
            cvc: '123'
        });

        // 4. Verify Success and Redirect
        await checkoutPage.verifySuccess();
        await page.waitForURL(/.*post-job.*/, { timeout: 10000 });
        await expect(page).toHaveURL(/.*post-job.*/);

        console.log('✅ Payment flow test passed: Card method');
    });

    test('Employer path: Automatic redirect from Post Job', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        // 1. Register as Employer
        await registerPage.register('Employer', 'Redirect Tester', `redir_${timestamp}@test.com`, password);
        await page.waitForTimeout(2000);

        // 2. Go straight to post-job and try to submit with all required fields
        await page.goto('http://localhost:3000/post-job');
        await page.fill('input[name="title"]', 'Tester Job');
        await page.click('button:has-text("Select talent area")');
        await page.click('div[role="option"]:has-text("Software Engineering")');
        await page.fill('input[name="company"]', 'Test Corp');
        await page.fill('input[name="location"]', 'Remote');

        // Fill contract style (REQUIRED)
        await page.click('button:has-text("How will they work?")');
        await page.click('div[role="option"]:has-text("Full-time")');

        await page.fill('input[name="salary"]', '5000');
        await page.fill('textarea[name="description"]', 'Need a tester.');

        await page.click('button[type="submit"]');

        // 3. Verify automatic redirect to checkout
        await page.waitForURL(/.*checkout.*/, { timeout: 15000 });
        await expect(page).toHaveURL(/.*checkout.*/);
        await expect(page.locator('text=Complete Your Payment')).toBeVisible();

        console.log('✅ Automatic redirect to checkout test passed');
    });

    test('Admin path: Bypass payment requirement', async ({ page }) => {
        const adminPage = new AdminPage(page);
        const jobPage = new JobPage(page);

        // 1. Login as Admin
        await adminPage.loginAsAdmin('admin@khmerwork.com', 'password123');

        // 2. Go to post job and submit
        await jobPage.postJob({
            title: `Admin Job ${timestamp}`,
            category: 'Software Engineering',
            company: 'Admin Corp',
            location: 'Remote',
            type: 'Full-time',
            salary: '5000',
            description: 'Admin skip payment check.'
        });

        // 3. Verify success immediately (no redirect)
        await expect(page.locator('h1')).toContainText('Listing Published!');
        await expect(page).toHaveURL(/.*post-job.*/);

        console.log('✅ Admin bypass test passed');
    });
});
