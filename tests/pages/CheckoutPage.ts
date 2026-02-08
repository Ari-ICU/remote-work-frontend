
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
    async fillCardDetails(details: {
        name: string;
        cardNumber: string;
        expiry: string;
        cvc: string;
    }) {
        await this.page.click('button:has-text("Card")');
        await this.page.fill('input[name="cardholderName"]', details.name);
        await this.page.fill('input[name="cardNumber"]', details.cardNumber);
        await this.page.fill('input[name="expiryDate"]', details.expiry);
        await this.page.fill('input[name="cvc"]', details.cvc);
        await this.page.click('button:has-text("Pay $")');
    }

    async fillPayPalDetails(email: string) {
        await this.page.click('button:has-text("PayPal")');
        await this.page.fill('#paypalEmail', email);
        await this.page.click('button:has-text("Continue with PayPal")');
    }

    async fillKHQRDetails(phone: string) {
        await this.page.click('button:has-text("KHQR")');
        await this.page.fill('#khqrPhone', phone);
        await this.page.click('button:has-text("Generate KHQR Code")');
        // KHQR has a simulation delay
        await this.page.waitForSelector('text=Payment Successful!', { timeout: 10000 });
    }

    async verifySuccess() {
        await expect(this.page.locator('text=Payment Successful!')).toBeVisible({ timeout: 10000 });
    }
}
