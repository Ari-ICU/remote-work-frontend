
import { test, expect } from '@playwright/test';
import { AdminPage } from './pages/AdminPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobPage } from './pages/JobPage';

test.describe('Admin Dashboard Features', () => {
    test.setTimeout(180000);

    const timestamp = Date.now();
    const testUserEmail = `test_admin_user_${timestamp}@test.com`;
    const testJobTitle = `Admin Test Job ${timestamp}`;
    const testFreelancerEmail = `test_freelancer_${timestamp}@test.com`;

    test('Test all admin dashboard features', async ({ page, browser }) => {
        page.on('console', msg => console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`));
        const adminPage = new AdminPage(page);

        // 1. Initial Cleanup to have a clean state for deterministic search
        console.log('--- Step 1: Login & Initial Cleanup ---');
        await adminPage.loginAsAdmin('admin@khmerwork.com', 'password123');
        await adminPage.triggerCleanup();
        console.log('✅ Logged in and cleaned up test data.');

        // 2. User Management
        console.log('\n--- Step 2: User Management Test ---');
        await adminPage.goToUsers();

        // Add User
        await adminPage.addUser({
            firstName: 'AdminTest',
            lastName: 'User',
            email: testUserEmail,
            role: 'FREELANCER'
        });
        console.log('✅ Added new user.');

        // Search User
        await adminPage.searchUser(testUserEmail);
        await expect(page.locator(`text=${testUserEmail}`)).toBeVisible();
        console.log('✅ Search functionality verified.');

        // Delete User
        await adminPage.deleteUser(testUserEmail);
        await expect(page.locator(`text=${testUserEmail}`)).not.toBeVisible();
        console.log('✅ User deletion verified.');

        // 3. Create some data to test Jobs & Applications management
        console.log('\n--- Step 3: Preparing Job & Application data ---');
        const employerContext = await browser.newContext();
        const empPage = await employerContext.newPage();
        const empRegister = new RegisterPage(empPage);
        const empJob = new JobPage(empPage);

        const employerEmail = `emp_admin_test_${timestamp}@test.com`;
        await empRegister.register('Employer', 'AdminTest', employerEmail, 'Password123!');
        await empJob.postJob({
            title: testJobTitle,
            category: 'Software Engineering',
            company: 'AdminTest Corp',
            location: 'Remote',
            type: 'Full-time',
            salary: '1000',
            description: 'Test job for admin dashboard moderation.'
        });
        console.log('✅ Job created by employer.');

        const freelancerContext = await browser.newContext();
        const freePage = await freelancerContext.newPage();
        const freeRegister = new RegisterPage(freePage);
        const freeJob = new JobPage(freePage);
        await freeRegister.register('Freelancer', 'Freelancer AdminTest', testFreelancerEmail, 'Password123!');
        await freeJob.searchAndSelectJob(testJobTitle);
        // We'll need a dummy file for application
        const path = require('path');
        const fs = require('fs');
        const dummyPath = path.resolve(__dirname, 'admin_dummy.pdf');
        fs.writeFileSync(dummyPath, 'Dummy content');

        await freeJob.applyToJob({
            fullName: 'Freelancer AdminTest',
            email: testFreelancerEmail,
            phone: '123456789',
            coverLetter: 'Admin test cover letter',
            proposedRate: '50',
            estimatedTime: '2 days',
            resumePath: dummyPath
        });
        console.log('✅ Application submitted.');
        fs.unlinkSync(dummyPath);

        // 4. Job Moderation
        console.log('\n--- Step 4: Job Moderation Test ---');
        await page.bringToFront();
        await adminPage.goToJobs();
        await adminPage.updateJobStatus(testJobTitle, 'Approve');
        console.log('✅ Job approved via admin panel.');

        // 5. Application Moderation
        console.log('\n--- Step 5: Application Moderation Test ---');
        await adminPage.goToApplications();
        await adminPage.updateApplicationStatus('Freelancer AdminTest', 'Accept');
        console.log('✅ Application accepted via admin panel.');

        // 6. Final Cleanup
        console.log('\n--- Step 6: Final Cleanup ---');
        await adminPage.triggerCleanup();
        console.log('✅ Final cleanup complete.');

        await employerContext.close();
        await freelancerContext.close();
    });
});
