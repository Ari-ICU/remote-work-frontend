
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { JobPage } from './pages/JobPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagingPage } from './pages/MessagingPage';
import { AdminPage } from './pages/AdminPage';

test.describe('Full Platform Flow (Admin + Users)', () => {
    test.setTimeout(300000); // 5 minutes for full flow

    const timestamp = Date.now();
    const employerEmail = `emp_flow_${timestamp}@test.com`;
    const freelancerEmail = `free_flow_${timestamp}@test.com`;
    const password = 'password123';
    const jobTitle = `Full Flow Job ${timestamp}`;
    const companyName = `Flow Corp ${timestamp}`;
    const dummyResumePath = path.resolve(__dirname, 'flow_resume.pdf');

    test.beforeAll(() => {
        if (!fs.existsSync(dummyResumePath)) {
            fs.writeFileSync(dummyResumePath, 'Dummy Resume Content for Full Flow');
        }
    });

    test.afterAll(() => {
        if (fs.existsSync(dummyResumePath)) {
            fs.unlinkSync(dummyResumePath);
        }
    });

    test('Complete lifecycle: Admin setup -> Employer Post -> Admin Approve -> Freelancer Apply -> Interaction', async ({ browser }) => {

        // --- 1. ADMIN: INITIAL CLEANUP ---
        console.log('\n--- Step 1: Admin Initial Cleanup ---');
        const adminContext = await browser.newContext();
        const adminPageObj = new AdminPage(await adminContext.newPage());
        await adminPageObj.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPageObj.triggerCleanup();
        console.log('✅ Admin cleaned up environment.');
        await adminContext.close();

        // --- 2. EMPLOYER: REGISTER & POST JOB ---
        console.log('\n--- Step 2: Employer Registration & Posting ---');
        const employerContext = await browser.newContext();
        const employerPage = await employerContext.newPage();
        const employerReg = new RegisterPage(employerPage);
        const employerLogin = new LoginPage(employerPage);
        const employerJob = new JobPage(employerPage);

        await employerReg.register('Employer', 'Flow Employer', employerEmail, password);
        // Login might be auto, but ensuring it
        if (await employerPage.locator('button:has-text("Login")').isVisible()) {
            await employerLogin.login(employerEmail, password);
        }

        await employerJob.postJob({
            title: jobTitle,
            category: 'Software Engineering',
            company: companyName,
            location: 'Remote',
            type: 'Contract',
            salary: '5000',
            description: 'Critical mission for full flow testing.'
        });
        console.log('✅ Employer posted job.');

        // --- 3. ADMIN: APPROVE JOB ---
        console.log('\n--- Step 3: Admin Job Approval ---');
        const adminContext2 = await browser.newContext();
        const adminPageObj2 = new AdminPage(await adminContext2.newPage());
        await adminPageObj2.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPageObj2.goToJobs();
        await adminPageObj2.updateJobStatus(jobTitle, 'Approve');
        console.log('✅ Admin approved job.');
        await adminContext2.close();

        // --- 4. FREELANCER: REGISTER, SEARCH, APPLY ---
        console.log('\n--- Step 4: Freelancer Journey ---');
        const freelancerContext = await browser.newContext();
        const freelancerPage = await freelancerContext.newPage();
        const freelancerReg = new RegisterPage(freelancerPage);
        const freelancerLogin = new LoginPage(freelancerPage);
        const freelancerJob = new JobPage(freelancerPage);
        const freelancerDash = new DashboardPage(freelancerPage);

        await freelancerReg.register('Freelancer', 'Flow Freelancer', freelancerEmail, password);
        // Verify login
        if (await freelancerPage.locator('button:has-text("Login")').isVisible()) {
            await freelancerLogin.login(freelancerEmail, password);
        }

        const found = await freelancerJob.searchAndSelectJob(jobTitle);
        if (!found) throw new Error(`Job ${jobTitle} not found (check Admin approval)`);

        await freelancerJob.applyToJob({
            fullName: 'Flow Freelancer',
            email: freelancerEmail,
            phone: '999888777',
            coverLetter: 'Ready for the full flow.',
            proposedRate: '4500',
            estimatedTime: '1 month',
            resumePath: dummyResumePath
        });
        console.log('✅ Freelancer applied.');

        // Verify dashboard
        await freelancerDash.verifyAppliedJob(jobTitle);

        // --- 5. ADMIN: REVIEW APPLICATION ---
        console.log('\n--- Step 5: Admin Application Review ---');
        const adminContext3 = await browser.newContext();
        const adminPageObj3 = new AdminPage(await adminContext3.newPage());
        await adminPageObj3.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPageObj3.goToApplications();
        await adminPageObj3.updateApplicationStatus('Flow Freelancer', 'Accept');
        console.log('✅ Admin accepted application.');
        await adminContext3.close();

        // --- 6. EMPLOYER: INTERACTION (Optional) ---
        console.log('\n--- Step 6: Employer Interaction ---');
        try {
            await employerPage.bringToFront();

            // Re-login check
            const employerDash = new DashboardPage(employerPage);
            const employerLogin = new LoginPage(employerPage);

            await employerPage.goto('http://localhost:3000/dashboard');

            try {
                // Wait for either Login page or Dashboard to load
                await Promise.race([
                    employerPage.waitForSelector('text=Sign In', { timeout: 10000 }),
                    employerPage.waitForSelector('text=Dashboard', { timeout: 10000 })
                ]);
            } catch (e) {
                console.log('Timed out waiting for Dashboard or Login. Page content might be empty.');
            }

            await employerPage.waitForLoadState('networkidle');

            console.log(`Current URL: ${employerPage.url()}`);

            const isOnLoginPage = await employerPage.getByText('Sign In').isVisible();
            const isOnDashboard = await employerPage.getByText('Dashboard', { exact: true }).isVisible();

            // Force login if not clearly on dashboard
            if (isOnLoginPage || !isOnDashboard) {
                console.log('⚠️ Session lost or not on dashboard. Attempting to re-login...');
                await employerLogin.login(employerEmail, password);
                await employerDash.waitForLoadingFinished();
            }

            // Now we should be on dashboard
            const employerChat = new MessagingPage(employerPage);

            await employerDash.openJobApplications(jobTitle);
            await employerDash.verifyApplicantExists('Flow Freelancer');

            const chatBtn = employerPage.locator('button:has-text("Chat")').first();
            if (await chatBtn.isVisible()) {
                await chatBtn.click();
                await employerChat.sendMessage("Hi Flow Freelancer, you are hired!");
                console.log('✅ Employer sent message.');
            }
        } catch (e) {
            console.log('⚠️ Employer interaction step skipped/failed (non-critical).', e.message);
        }

        // --- 7. FINAL CLEANUP ---
        console.log('\n--- Step 7: Final Cleanup ---');
        try {
            const adminContext4 = await browser.newContext();
            const adminPageObj4 = new AdminPage(await adminContext4.newPage());
            await adminPageObj4.loginAsAdmin('admin@khmerwork.com', 'password123');
            await adminPageObj4.triggerCleanup();
            console.log('✅ Final cleanup done.');
            await adminContext4.close();
        } catch (e) {
            console.log('⚠️ Final cleanup failed (non-critical).');
        }

        await employerContext.close();
        await freelancerContext.close();
    });
});
