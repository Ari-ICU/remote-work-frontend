
import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
    async selectPlan(planName: string) {
        await this.navigateTo('/pricing');
        const ctaText = planName === 'Featured' ? 'Promote Your Job' :
            planName === 'Premium' ? 'Get Premium' : 'Post for Free';
        await this.page.click(`a:has-text("${ctaText}")`);
    }
}
