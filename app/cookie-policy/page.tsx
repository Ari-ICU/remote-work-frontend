export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-6">
                        <strong>Last Updated:</strong> February 8, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a
                            website. They are widely used to make websites work more efficiently and provide information to
                            the owners of the site. Cookies help us understand how you use our website and improve your
                            experience.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            KhmerWork uses cookies for various purposes:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly, such as maintaining your login session</li>
                            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information</li>
                            <li><strong>Functionality Cookies:</strong> Remember your preferences and settings to provide enhanced features</li>
                            <li><strong>Analytics Cookies:</strong> Allow us to analyze website traffic and improve our services</li>
                            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Session Cookies</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                These are temporary cookies that remain in your browser until you leave the website. They help
                                us maintain your session and remember your actions during a single browsing session.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Persistent Cookies</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                These cookies remain on your device for a set period or until you delete them. They help us
                                recognize you as a returning visitor and remember your preferences.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-foreground mb-3">3.3 First-Party Cookies</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                These are set by KhmerWork directly and can only be read by our website.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-foreground mb-3">3.4 Third-Party Cookies</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                These are set by third-party services we use, such as analytics providers, payment processors,
                                and social media platforms.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Specific Cookies We Use</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-border rounded-lg overflow-hidden">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Cookie Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Purpose</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">auth_token</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">Maintains your login session</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">7 days</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">user_preferences</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">Stores your site preferences</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">1 year</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">_ga</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">Google Analytics - tracks visitors</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">2 years</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">_gid</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">Google Analytics - distinguishes users</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">24 hours</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">theme</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">Remembers your theme preference</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">1 year</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">5. Managing Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie
                            preferences by:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                            <li>Using our cookie consent tool when you first visit our website</li>
                            <li>Adjusting your browser settings to refuse cookies</li>
                            <li>Deleting cookies that have already been set</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed">
                            Please note that if you choose to block or delete cookies, some features of our website may not
                            function properly, and you may not be able to access certain parts of the site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">6. Browser-Specific Instructions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To manage cookies in your browser, please refer to the following links:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                            <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                            <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                            <li><strong>Opera:</strong> Settings → Privacy & security → Cookies and other site data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use the following third-party services that may set cookies:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
                            <li><strong>Stripe:</strong> For secure payment processing</li>
                            <li><strong>PayPal:</strong> For payment processing</li>
                            <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            These third parties have their own privacy policies and cookie policies. We recommend reviewing
                            them to understand how they use cookies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">8. Updates to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in our practices or for
                            other operational, legal, or regulatory reasons. We will notify you of any material changes by
                            posting the new Cookie Policy on this page and updating the "Last Updated" date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about our use of cookies, please contact us at:
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
