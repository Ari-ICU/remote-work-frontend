
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

test.describe('Multi-user Simulation', () => {
    test.setTimeout(180000);

    const timestamp = Date.now();
    const employerEmail = `employer_${timestamp}@test.com`;
    const freelancerEmail = `free_${timestamp}@test.com`;
    const password = 'password123';
    const jobTitle = `Full-Feature Job ${timestamp}`;
    const companyName = `AutoTest Corp ${timestamp}`;
    const dummyResumePath = path.resolve(__dirname, 'dummy_resume.pdf');

    test.beforeAll(() => {
        if (!fs.existsSync(dummyResumePath)) {
            fs.writeFileSync(dummyResumePath, 'Dummy Resume Content');
        }
    });

    test.afterAll(() => {
        if (fs.existsSync(dummyResumePath)) {
            fs.unlinkSync(dummyResumePath);
        }
    });

    test('Full platform feature journey', async ({ browser }) => {
        // --- 1. SET UP CONTEXTS ---
        const employerContext = await browser.newContext();
        const freelancerContext = await browser.newContext();
        const employerPageObj = new JobPage(await employerContext.newPage());
        const employerReg = new RegisterPage(employerPageObj['page']);
        const employerLogin = new LoginPage(employerPageObj['page']);
        const employerProfile = new ProfilePage(employerPageObj['page']);
        const employerDash = new DashboardPage(employerPageObj['page']);
        const employerChat = new MessagingPage(employerPageObj['page']);

        const freelancerPageObj = new JobPage(await freelancerContext.newPage());
        const freelancerReg = new RegisterPage(freelancerPageObj['page']);
        const freelancerLogin = new LoginPage(freelancerPageObj['page']);
        const freelancerDash = new DashboardPage(freelancerPageObj['page']);
        const freelancerProfile = new ProfilePage(freelancerPageObj['page']);
        const freelancerChat = new MessagingPage(freelancerPageObj['page']);

        // --- 2. EMPLOYER: REGISTER & POST JOB ---
        console.log('\n--- Step 1: Employer Registration & Posting ---');
        await employerReg.register('Employer', 'Test Employer', employerEmail, password);
        if (await employerReg.isRegistrationSuccessful()) {
            console.log('✅ Employer registered successfully.');
        } else {
            console.log('ℹ️ Attempting login (account might exist).');
        }
        await employerLogin.login(employerEmail, password);

        await employerProfile.updateBasicInfo('Test', 'Employer');
        console.log('✅ Employer profile name verified/updated.');

        await employerPageObj.postJob({
            title: jobTitle,
            category: 'Software Engineering',
            company: companyName,
            location: 'Remote',
            type: 'Freelance / Contract',
            salary: '50-100',
            description: 'This is a description for the full feature test.'
        });
        console.log('✅ Employer posted job successfully.');

        // --- 3. FREELANCER: REGISTER & APPLY ---
        console.log('\n--- Step 2: Freelancer Registration & Search ---');
        await freelancerReg.register('Freelancer', 'Test Freelancer', freelancerEmail, password);
        await freelancerLogin.login(freelancerEmail, password);

        const found = await freelancerPageObj.searchAndSelectJob(jobTitle);
        if (!found) throw new Error(`Job ${jobTitle} not found after retries`);
        console.log('✅ Freelancer found and viewed job.');

        console.log('\n--- Step 3: Freelancer Application ---');
        await freelancerPageObj.applyToJob({
            fullName: 'Test Freelancer',
            email: freelancerEmail,
            phone: '+1234567890',
            coverLetter: 'I am the perfect candidate for this automated test.',
            proposedRate: '75',
            estimatedTime: '1 week',
            resumePath: dummyResumePath
        });
        console.log('✅ Freelancer submitted application successfully.');

        // --- 4. VERIFICATIONS & UPDATES ---
        console.log('\n--- Step 4: Freelancer Dashboard Verification ---');
        await freelancerDash.verifyAppliedJob(jobTitle);
        console.log('✅ Freelancer dashboard shows applied job.');

        console.log('\n--- Step 5: Profile Update ---');
        const newHeadline = `Expert Automator ${timestamp}`;
        await freelancerProfile.updateHeadlineAndBio(newHeadline, 'I love testing full stack applications.');
        await freelancerProfile.addSkill('Playwright');
        await freelancerProfile.saveChanges();
        await freelancerProfile.verifyHeadline(newHeadline);
        console.log('✅ Profile updated successfully.');

        // --- 5. EMPLOYER: REVIEW & CHAT ---
        console.log('\n--- Step 6: Employer Dashboard & Application Review ---');
        await employerDash.openJobApplications(jobTitle);
        await employerDash.verifyApplicantExists('Test Freelancer');
        console.log('✅ Employer dashboard verification complete.');

        console.log('\n--- Step 7: Real-time Chat Test ---');
        const chatBtn = employerPageObj['page'].locator('div').filter({ hasText: 'Test Freelancer' }).first().locator('button:has-text("Chat")');
        await chatBtn.click();

        await employerChat.sendMessage(`Hello! Interested in your profile for ${jobTitle}.`);
        console.log('Employer: Sent message.');

        await freelancerChat.navigateTo('/messages');
        await freelancerChat.openChatWith('Test Employer');
        await freelancerChat.verifyMessageReceived(`Hello! Interested in your profile for ${jobTitle}.`);

        const freelancerReply = "Thank you! I am very interested.";
        await freelancerChat.sendMessage(freelancerReply);
        console.log('Freelancer: Sent reply.');

        await employerChat.verifyMessageReceived(freelancerReply);
        console.log('✅ Real-time chat verified successfully.');

        // --- 6. CLEANUP ---
        console.log('\n--- Step 8: Auto-Cleanup Test Data ---');
        const adminPage = new AdminPage(await browser.newPage());
        try {
            await adminPage.loginAsAdmin('admin@khmerwork.com', 'password123');
            const result = await adminPage.triggerCleanup();
            console.log(`✅ Auto-Cleanup completed: ${result.message}`);
        } catch (e) {
            console.error('❌ Auto-Cleanup failed:', e);
        }

        await employerContext.close();
        await freelancerContext.close();
    });
});
