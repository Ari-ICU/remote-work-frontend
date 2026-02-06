"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fadeIn, staggerContainer } from "@/lib/animations";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Post your job and start receiving applications.",
        features: [
            "1 Job Posting",
            "Live for 30 days",
            "Standard listing",
            "Email support",
            "Basic applicant management"
        ],
        highlight: false,
        cta: "Post for Free",
        href: "/post-job"
    },
    {
        name: "Featured",
        price: "$49",
        description: "Boost visibility and get more quality applicants.",
        features: [
            "Everything in Free",
            "Featured badge on listing",
            "2x visibility in search results",
            "Highlighted in job feed",
            "Social media promotion",
            "Priority support"
        ],
        highlight: true,
        cta: "Promote Your Job",
        href: "/checkout?plan=featured"
    },
    {
        name: "Premium",
        price: "$99",
        description: "Maximum exposure for critical hires.",
        features: [
            "Everything in Featured",
            "Top of category placement",
            "Homepage featured spot",
            "Extended to 60 days",
            "Custom company branding",
            "Advanced analytics",
            "Dedicated account manager"
        ],
        highlight: false,
        cta: "Get Premium",
        href: "/checkout?plan=premium"
    }
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                        >
                            <Check className="h-4 w-4" />
                            Free Job Posting • Pay Only to Promote
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                        >
                            Post Jobs for Free
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-xl text-muted-foreground"
                        >
                            Start hiring with a free job posting. Upgrade to boost visibility and reach more qualified candidates faster.
                            <br />
                            <span className="text-base">No credit card required to post.</span>
                        </motion.p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid gap-8 lg:grid-cols-3 lg:gap-8"
                    >
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.name}
                                variants={fadeIn}
                                className={`flex flex-col rounded-3xl p-8 relative ${plan.highlight
                                    ? "bg-primary text-primary-foreground shadow-xl scale-105 z-10"
                                    : "bg-card border border-border text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                        <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-lg font-semibold ${plan.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                        <span className={`ml-1 text-sm font-semibold ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                            /post
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-sm ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 flex-1 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className={`p-1 rounded-full ${plan.highlight ? "bg-white/20" : "bg-primary/10"}`}>
                                                <Check className={`h-3 w-3 ${plan.highlight ? "text-white" : "text-primary"}`} />
                                            </div>
                                            <span className={`text-sm ${plan.highlight ? "text-primary-foreground/90" : "text-foreground"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    variant={plan.highlight ? "secondary" : "default"}
                                    size="lg"
                                    className={`w-full rounded-xl font-bold ${plan.highlight ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-primary-foreground"}`}
                                >
                                    <Link href={plan.href}>
                                        {plan.cta}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">
                            Have questions? <Link href="/contact" className="text-primary font-medium hover:underline">Contact our sales team</Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
