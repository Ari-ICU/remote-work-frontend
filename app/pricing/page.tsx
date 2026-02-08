"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fadeIn, staggerContainer } from "@/lib/animations";
import api from "@/lib/api";

interface Plan {
    id: string;
    name: string;
    price: number | string;
    description: string;
    features: string[];
    highlight: boolean;
    cta: string;
    href: string;
    badge?: string;
}


export default function PricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get("/pricing/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Header />
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground animate-pulse">Loading amazing plans...</p>
                </div>
                <Footer />
            </div>
        );
    }
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="absolute top-40 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[140px] -z-10" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20"
                        >
                            <Sparkles className="h-4 w-4" />
                            Free Job Posting • Pay Only to Promote
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6"
                        >
                            Find the <span className="text-primary italic">perfect</span> candidate
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-xl text-muted-foreground leading-relaxed"
                        >
                            Start hiring with a free job posting. Upgrade to boost visibility and reach more qualified candidates faster.
                            <br />
                            <span className="text-foreground font-medium">No credit card required to post.</span>
                        </motion.p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid gap-8 lg:grid-cols-3 lg:gap-8 items-center"
                    >
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                variants={fadeIn}
                                whileHover={{ y: -5 }}
                                className={`flex flex-col rounded-[2.5rem] p-10 relative h-full transition-all duration-300 ${plan.highlight
                                    ? "bg-[#006B3F] text-white shadow-2xl scale-105 z-10 border-none"
                                    : "bg-card border border-border/50 text-card-foreground shadow-sm hover:shadow-xl hover:border-primary/20"
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                                        <span className="bg-[#00A86B] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                            {plan.badge || "Most Popular"}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className={`text-2xl font-bold ${plan.highlight ? "text-white" : "text-foreground"}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-5xl font-black tracking-tight">
                                            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                                        </span>
                                        <span className={`text-lg font-medium ${plan.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                                            /post
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-sm font-medium leading-relaxed ${plan.highlight ? "text-white/90" : "text-muted-foreground"}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 flex-1 mb-10">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 group">
                                            <div className={`mt-0.5 p-1 rounded-full shrink-0 transition-colors ${plan.highlight ? "bg-white/20 group-hover:bg-white/30" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                                                <Check className={`h-3 w-3 ${plan.highlight ? "text-white" : "text-primary"}`} />
                                            </div>
                                            <span className={`text-sm font-medium ${plan.highlight ? "text-white/90" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    variant={plan.highlight ? "secondary" : "default"}
                                    size="lg"
                                    className={`w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95 ${plan.highlight
                                        ? "bg-white text-[#006B3F] hover:bg-white/90 hover:shadow-white/10"
                                        : "bg-primary text-primary-foreground hover:shadow-primary/25"}`}
                                >
                                    <Link href={plan.href} className="flex items-center justify-center gap-2">
                                        {plan.cta}
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 text-center"
                    >
                        <p className="text-muted-foreground font-medium">
                            Have questions? <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4">Contact our sales team</Link>
                        </p>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
