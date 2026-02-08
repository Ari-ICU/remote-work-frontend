export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-6">
                        <strong>Last Updated:</strong> February 8, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to KhmerWork. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we look after your personal data when you visit our
                            website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li><strong>Identity Data:</strong> First name, last name, username, or similar identifier</li>
                            <li><strong>Contact Data:</strong> Email address, telephone numbers, and billing address</li>
                            <li><strong>Profile Data:</strong> Your username and password, job preferences, feedback, and survey responses</li>
                            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, and location</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services</li>
                            <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your
                            personal data in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>To register you as a new user and manage your account</li>
                            <li>To process and deliver job applications and postings</li>
                            <li>To manage payments, fees, and charges</li>
                            <li>To communicate with you about your account or transactions</li>
                            <li>To send you marketing communications (with your consent)</li>
                            <li>To improve our website and services</li>
                            <li>To protect against fraud and ensure platform security</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being
                            accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal
                            data to those employees, agents, contractors, and other third parties who have a business need
                            to know.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We will only retain your personal data for as long as necessary to fulfill the purposes we
                            collected it for, including for the purposes of satisfying any legal, accounting, or reporting
                            requirements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Legal Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Under certain circumstances, you have rights under data protection laws in relation to your
                            personal data, including the right to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Request access to your personal data</li>
                            <li>Request correction of your personal data</li>
                            <li>Request erasure of your personal data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing your personal data</li>
                            <li>Request transfer of your personal data</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">7. Third-Party Links</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our website may include links to third-party websites, plug-ins, and applications. Clicking on
                            those links or enabling those connections may allow third parties to collect or share data about
                            you. We do not control these third-party websites and are not responsible for their privacy
                            statements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar tracking technologies to track activity on our website and hold
                            certain information. You can instruct your browser to refuse all cookies or to indicate when
                            a cookie is being sent. For more information, please see our Cookie Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                            the new Privacy Policy on this page and updating the "Last Updated" date at the top of this
                            Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-foreground"><strong>Email:</strong> privacy@khmerwork.com</p>
                            <p className="text-foreground"><strong>Address:</strong> Phnom Penh, Cambodia</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
