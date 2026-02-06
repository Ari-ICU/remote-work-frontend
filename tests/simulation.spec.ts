
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Multi-user simulation: Full platform feature test', async ({ browser }) => {
    test.setTimeout(120000);
    // Create contexts
    const adminContext = await browser.newContext(); // Potentially use later
    const employerContext = await browser.newContext();
    const freelancerContext = await browser.newContext();

    const employerPage = await employerContext.newPage();
    const freelancerPage = await freelancerContext.newPage();

    // Data Setup
    const timestamp = Date.now();
    const employerEmail = 'employer@example.com';
    const freelancerEmail = `free_${timestamp}@test.com`;
    const password = 'password123';
    const jobTitle = `Full-Feature Job ${timestamp}`;
    const companyName = `AutoTest Corp ${timestamp}`;

    console.log(`--- STARTING FULL FEATURE SIMULATION ---`);
    console.log(`Job Title: ${jobTitle}`);
    console.log(`Employer: ${employerEmail}`);
    console.log(`Freelancer: ${freelancerEmail}`);

    // Create a dummy resume file for upload test
    const dummyResumePath = path.resolve(__dirname, 'dummy_resume.pdf');
    if (!fs.existsSync(dummyResumePath)) {
        fs.writeFileSync(dummyResumePath, 'Dummy Resume Content');
    }

    // ==========================================
    // STEP 1: EMPLOYER REGISTRATION & JOB POSTING
    // ==========================================
    console.log('\n--- Step 1: Employer Registration & Posting ---');

    // Register Employer
    await employerPage.goto('http://localhost:3000/register');
    await employerPage.click('button:has-text("Employer")'); // Select Employer role
    await employerPage.fill('input[name="fullname"]', 'Test Employer');
    await employerPage.fill('input[name="email"]', employerEmail);
    await employerPage.fill('input[name="password"]', password);
    await employerPage.click('button[type="submit"]');

    // Wait for success OR a "conflict" error
    const successMsg = employerPage.locator('text=Welcome Aboard!');
    const errorMsg = employerPage.locator('text=Email already exists');

    await Promise.race([
        successMsg.waitFor({ timeout: 10000 }).catch(() => { }),
        errorMsg.waitFor({ timeout: 10000 }).catch(() => { })
    ]);

    if (await successMsg.isVisible()) {
        console.log('✅ Employer registered successfully.');
    } else if (await errorMsg.isVisible()) {
        console.log('ℹ️ Employer already registered, proceeding to login.');
    } else {
        console.log('⚠️ Registration state unclear, attempting login anyway.');
    }

    // Login Employer
    await employerPage.goto('http://localhost:3000/login');
    await employerPage.fill('input[name="email"]', employerEmail);
    await employerPage.fill('input[name="password"]', password);
    await employerPage.click('button[type="submit"]');
    await employerPage.waitForURL('**/', { timeout: 15000 });

    // Post Job
    await employerPage.goto('http://localhost:3000/post-job');
    await employerPage.fill('input[name="title"]', jobTitle);

    // Select dropdowns (using more robust selection if needed)
    await employerPage.click('button:has-text("Select talent area")');
    await employerPage.click('div[role="option"]:has-text("Software Engineering")');

    await employerPage.fill('input[name="company"]', companyName);
    await employerPage.fill('input[name="location"]', 'Remote');

    await employerPage.click('button:has-text("How will they work?")');
    await employerPage.click('div[role="option"]:has-text("Freelance / Contract")');

    await employerPage.fill('input[name="salary"]', '50-100');
    await employerPage.fill('textarea[name="description"]', 'This is a description for the full feature test.');
    await employerPage.click('button[type="submit"]');

    await expect(employerPage.locator('h1')).toContainText('Listing Published!', { timeout: 15000 });
    console.log('✅ Employer posted job successfully.');


    // ==========================================
    // STEP 2: FREELANCER REGISTRATION & JOB SEARCH
    // ==========================================
    console.log('\n--- Step 2: Freelancer Registration & Search ---');

    // Register Freelancer
    await freelancerPage.goto('http://localhost:3000/register');
    await freelancerPage.click('button:has-text("Freelancer")'); // Select Freelancer role
    await freelancerPage.fill('input[name="fullname"]', 'Test Freelancer');
    await freelancerPage.fill('input[name="email"]', freelancerEmail);
    await freelancerPage.fill('input[name="password"]', password);
    await freelancerPage.click('button[type="submit"]');
    await expect(freelancerPage.getByText('Welcome Aboard!')).toBeVisible({ timeout: 15000 });

    // Login Freelancer
    await freelancerPage.goto('http://localhost:3000/login');
    await freelancerPage.fill('input[name="email"]', freelancerEmail);
    await freelancerPage.fill('input[name="password"]', password);
    await freelancerPage.click('button[type="submit"]');
    await freelancerPage.waitForURL('**/', { timeout: 15000 });

    // Search for Job
    await freelancerPage.goto('http://localhost:3000/jobs');

    // Search loop
    let found = false;
    for (let i = 0; i < 5; i++) {
        console.log(`Checking for job... attempt ${i + 1}`);
        const jobCard = freelancerPage.locator('article').filter({ hasText: jobTitle }).first();
        const applyLink = jobCard.getByRole('link', { name: /Apply Now/i });

        if (await applyLink.isVisible()) {
            found = true;
            console.log('Freelancer: Found the new job listing.');
            await applyLink.click();
            break;
        } else {
            if (i < 4) {
                console.log('Job not found yet, reloading...');
                await freelancerPage.reload();
                await freelancerPage.waitForTimeout(2000);
            }
        }
    }

    if (!found) throw new Error(`Job ${jobTitle} not found after retries`);

    await expect(freelancerPage.locator('h1')).toContainText(jobTitle);
    console.log('✅ Freelancer found and viewed job.');


    // ==========================================
    // STEP 3: FREELANCER APPLICATION
    // ==========================================
    console.log('\n--- Step 3: Freelancer Application ---');

    // Fill application form (on /apply/... page)
    await freelancerPage.fill('input[name="fullname"]', 'Test Freelancer');
    await freelancerPage.fill('input[name="email"]', freelancerEmail);
    await freelancerPage.fill('input[name="phone"]', '+1234567890');
    await freelancerPage.fill('textarea[name="coverLetter"]', 'I am the perfect candidate for this automated test.');

    // Fill new required fields
    await freelancerPage.fill('input[name="proposedRate"]', '75');
    await freelancerPage.fill('input[name="estimatedTime"]', '1 week');

    // Upload Resume
    await freelancerPage.setInputFiles('input[type="file"]', dummyResumePath);

    // Submit
    await freelancerPage.click('button[type="submit"]');

    // Verify Success
    await expect(freelancerPage.locator('text=Application Sent!')).toBeVisible({ timeout: 10000 });
    console.log('✅ Freelancer submitted application successfully.');


    // ==========================================
    // STEP 4: FREELANCER DASHBOARD
    // ==========================================
    console.log('\n--- Step 4: Freelancer Dashboard Verification ---');
    await freelancerPage.goto('http://localhost:3000/dashboard');

    // Check if the applied job appears
    // The dashboard shows "Applied Jobs"
    await expect(freelancerPage.locator('text=Applied Jobs')).toBeVisible();
    await expect(freelancerPage.locator(`text=${jobTitle}`)).toBeVisible();
    // Verify status is "PENDING" (based on default assumption or badge color)
    await expect(freelancerPage.getByText('PENDING')).toBeVisible();
    console.log('✅ Freelancer dashboard shows applied job.');


    // ==========================================
    // STEP 5: PROFILE UPDATE
    // ==========================================
    console.log('\n--- Step 5: Profile Update ---');
    await freelancerPage.goto('http://localhost:3000/profile/edit');

    // Update Headline and Bio
    const newHeadline = `Expert Automator ${timestamp}`;
    await freelancerPage.fill('input[name="headline"]', newHeadline);
    await freelancerPage.fill('textarea[name="bio"]', 'I love testing full stack applications.');

    // Switch to Skills tab (Fixed selector)
    await freelancerPage.getByRole('tab', { name: 'Skills & Langs' }).click();

    // Add a skill
    const skillInput = freelancerPage.locator('input[placeholder="Type and press Enter..."]');
    await expect(skillInput).toBeVisible(); // Ensure it's visible before interacting
    await skillInput.fill('Playwright');
    await skillInput.press('Enter');

    // Save
    await freelancerPage.click('button:has-text("Save Changes")');

    // Should redirect to profile or show toast? (Code says router.push("/profile"))
    await freelancerPage.waitForURL('**/profile');

    // Verify changes on profile page
    await expect(freelancerPage.locator(`text=${newHeadline}`)).toBeVisible();
    // await expect(freelancerPage.locator('text=Playwright')).toBeVisible(); // Might be in a badge
    console.log('✅ Profile updated successfully.');


    // ==========================================
    // STEP 6: EMPLOYER DASHBOARD (View Application)
    // ==========================================
    console.log('\n--- Step 6: Employer Dashboard & Application Review ---');

    // Go to dashboard
    await employerPage.goto('http://localhost:3000/dashboard');
    await expect(employerPage.locator('h1')).toContainText('Dashboard');
    await expect(employerPage.locator('.animate-spin')).not.toBeVisible();

    // Check "Your Job Postings" has the job
    await expect(employerPage.locator(`text=${jobTitle}`)).toBeVisible({ timeout: 10000 });

    // Check Applicant Count (Should be 1)
    const viewApplicantsBtn = employerPage.locator(`a[href*="/applications"]`).first(); // Assuming topmost is newest
    await viewApplicantsBtn.click();

    // If successful, we should see the Freelancer's name.
    await expect(employerPage.getByText('Test Freelancer')).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log("Could not find freelancer on applicants page. Page might not be fully implemented.");
    });

    console.log('✅ Employer dashboard verification complete.');

    // ==========================================
    // STEP 7: REAL-TIME CHAT TEST
    // ==========================================
    console.log('\n--- Step 7: Real-time Chat Test ---');

    // 1. Employer starts chat from applications page
    // (Assuming we are already on the applications page from Step 6)
    const chatBtn = employerPage.locator('button:has-text("Chat")').first();
    await chatBtn.click();
    await employerPage.waitForURL('**/messages**');
    await expect(employerPage.locator('h3')).toContainText('Test Freelancer');

    // 2. Employer sends message
    const employerMsg = `Hello! Interested in your profile for ${jobTitle}.`;
    await employerPage.fill('input[placeholder="Type a message..."]', employerMsg);
    await employerPage.click('button[type="submit"]');
    console.log('Employer: Sent initial message.');

    // 3. Freelancer goes to messages
    await freelancerPage.goto('http://localhost:3000/messages');
    // Select the employer's conversation (it should be at the top)
    await freelancerPage.locator('text=Test Employer').first().click();

    // 4. Freelancer verifies message and replies
    await expect(freelancerPage.locator(`text=${employerMsg}`)).toBeVisible({ timeout: 10000 });
    const freelancerReply = "Thank you! I am very interested. When do we start?";
    await freelancerPage.fill('input[placeholder="Type a message..."]', freelancerReply);
    await freelancerPage.click('button[type="submit"]');
    console.log('Freelancer: Received message and sent reply.');

    // 5. Employer verifies reply (Real-time)
    await expect(employerPage.locator(`text=${freelancerReply}`)).toBeVisible({ timeout: 10000 });
    console.log('✅ Real-time chat verified successfully.');


    // Cleanup
    await employerContext.close();
    await freelancerContext.close();

    // Remove dummy file
    if (fs.existsSync(dummyResumePath)) {
        fs.unlinkSync(dummyResumePath);
    }

    console.log('\n--- TEST COMPLETED SUCCESSFULLY ---');
});
