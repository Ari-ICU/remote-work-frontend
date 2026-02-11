
import { test, expect } from '@playwright/test';

test.describe('Frontend Security Tests', () => {

    test('Unauthenticated Access: Should redirect to login for protected routes', async ({ page }) => {
        // List of routes that should be protected
        const protectedRoutes = [
            '/dashboard',
            '/profile',
            '/messages',
            '/admin'
        ];

        for (const route of protectedRoutes) {
            console.log(`Testing protected route: ${route}`);
            await page.goto(`http://localhost:3000${route}`);

            // Should be redirected to login page (url contains 'login' or 'signin')
            await expect(page).toHaveURL(/.*login.*/);
        }
    });

    // XSS Vulnerability Check is covered in tests/security-flow.spec.ts with a comprehensive flow.
    // The previous simple check on /jobs was skipped due to missing search input.

    test('Source Code: Should not expose generic secrets', async ({ page }) => {
        await page.goto('http://localhost:3000');
        const content = await page.content();

        const commonSecrets = [
            'AWS_ACCESS_KEY_ID',
            'BEGIN RSA PRIVATE KEY',
            'stripe_secret_key'
        ];

        for (const secret of commonSecrets) {
            expect(content).not.toContain(secret);
        }
    });

});
