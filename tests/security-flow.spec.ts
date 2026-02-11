
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { JobPage } from './pages/JobPage';
import { AdminPage } from './pages/AdminPage';

test.describe('Security Flow Tests (Stored XSS)', () => {
    test.setTimeout(60000); // 1 minute timeout

    test('Stored XSS: Job Title and Description should be stored but NOT executed', async ({ browser }) => {
        const uniqueId = `xss_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const employerEmail = `${uniqueId}@test.com`;
        const password = 'Password123!';
        const xssTitle = `Job ${uniqueId} <script>alert("XSS_Title")</script>`;
        const xssDesc = `Description <img src=x onerror=alert("XSS_Desc")>`;
        // --- 1. Register Employer ---
        const employerContext = await browser.newContext();
        const emPage = await employerContext.newPage();
        const emReg = new RegisterPage(emPage);
        const emLogin = new LoginPage(emPage);
        const emJob = new JobPage(emPage);

        console.log('Registering Employer...');
        await emReg.register('Employer', 'XSS Tester', employerEmail, password);

        // Ensure logged in
        if (await emPage.locator('button:has-text("Sign In")').isVisible()) {
            await emLogin.login(employerEmail, password);
        }

        // --- 2. Post Job with XSS Payload ---
        console.log('Posting job with XSS payload...');
        await emPage.goto('http://localhost:3000/post-job');

        // Fill Title
        await emPage.getByPlaceholder('e.g. Senior Product Designer').fill(xssTitle);

        // Company
        await emPage.getByPlaceholder('e.g. Acme Inc.').fill('Vulnerable Corp');

        // Location
        await emPage.getByPlaceholder('e.g. Remote (Global)').fill('Remote');

        // Work Category (Combobox)
        // Try clicking the trigger if found, otherwise skip if default works or try simple fill
        // Snapshot shows a combobox. Let's try locating by label "Work Category"
        // This part is tricky without accurate selector. Let's try to assume default or just click first combobox.
        const categoryTrigger = emPage.locator('button[role="combobox"]').first();
        if (await categoryTrigger.isVisible()) {
            await categoryTrigger.click();
            await emPage.getByRole('option').first().click(); // Select first option
        }

        // Skills
        await emPage.getByPlaceholder('e.g. React, TypeScript, Figma').fill('Security, XSS, Testing');

        // Contract Type - "FT Full-time"
        // Snapshot shows buttons with text "FT Full-time" inside.
        // We can match by text.
        await emPage.getByRole('button', { name: /Full-time/i }).click();

        // Salary
        await emPage.getByPlaceholder('2,000 - 4,000').fill('5000');

        // Description - Overview
        await emPage.getByPlaceholder('Introduce your company and the core mission').fill(xssDesc);

        // Visibility - Free
        await emPage.getByRole('button', { name: /Free \$0/i }).click();

        // Submit
        await emPage.getByRole('button', { name: 'Post Job Listing' }).click();

        // Wait for success toast or redirection
        await expect(emPage.getByText('Job listing created successfully', { exact: false })
            .or(emPage.getByText('Listing Published', { exact: false })))
            .toBeVisible({ timeout: 10000 });

        await employerContext.close();

        // --- 3. Admin Approves (Verify Admin is not XSSed) ---
        console.log('Admin reviewing job...');
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();
        const adminPageObj = new AdminPage(adminPage);

        // Fail test if dialog (alert) appears
        adminPage.on('dialog', async dialog => {
            const msg = dialog.message();
            console.error(`XSS Alert detected on Admin Page: ${msg}`);
            await dialog.dismiss();
            throw new Error(`XSS Vulnerability Detected on Admin Page! Alert message: ${msg}`);
        });

        await adminPageObj.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPageObj.goToJobs();

        // Find job by the unique ID part to avoid selector issues with script tags if any
        // However, we want to approve the one with the script tag.
        // We use the partial text match which Playwright supports well.
        await adminPageObj.updateJobStatus(uniqueId, 'Approve');

        console.log('Admin approved job.');
        await adminContext.close();

        // --- 4. Public View Verify (Verify Public user is not XSSed) ---
        console.log('Verifying public view...');
        const publicContext = await browser.newContext();
        const pubPage = await publicContext.newPage();

        pubPage.on('dialog', async dialog => {
            const msg = dialog.message();
            console.error(`XSS Alert detected on Public Page: ${msg}`);
            await dialog.dismiss();
            throw new Error(`XSS Vulnerability Detected on Public Page! Alert message: ${msg}`);
        });

        await pubPage.goto('http://localhost:3000/jobs');

        // Locate the job card
        // We check if the text is present. 
        // Note: usage of .first() might be risky if multiple match, but timestamp should be unique.
        const jobCard = pubPage.locator('article').filter({ hasText: uniqueId }).first();
        await expect(jobCard).toBeVisible();

        // Check that the script tag source is NOT executed.
        // If alert didn't pop up, we are good.
        // We can also verify the text content contains the script tag literally (escaped)
        const titleText = await jobCard.innerText();
        console.log(`Rendered Title: ${titleText}`);

        // If strict sanitization is in place, the script tag might be removed entirely.
        // If it's escaped, it will show as text.
        // Either is fine for security, as long as it didn't execute.
        // But we expect at least the "Job ..." part to be there.
        expect(titleText).toContain(`Job ${uniqueId}`);

        await publicContext.close();
    });
});
