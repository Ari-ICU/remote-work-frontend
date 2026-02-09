"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Target,
    Zap,
    Shield,
    Clock,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    HeadphonesIcon,
    Award,
    HelpCircle
} from "lucide-react";
import {
    hiringSolutionsService,
    HiringSolution,
    HiringStat,
    HiringPlan
} from "@/lib/services/hiring-solutions";

const IconMap: { [key: string]: any } = {
    Users,
    Target,
    Zap,
    Shield,
    Clock,
    TrendingUp,
    CheckCircle2,
    Award,
    Sparkles,
    HeadphonesIcon
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] || HelpCircle;
    return <Icon className={className} />;
}

export default function HiringSolutionsPage() {
    const [solutions, setSolutions] = useState<HiringSolution[]>([]);
    const [stats, setStats] = useState<HiringStat[]>([]);
    const [plans, setPlans] = useState<HiringPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sols, stts, plns] = await Promise.all([
                    hiringSolutionsService.getSolutions(),
                    hiringSolutionsService.getStats(),
                    hiringSolutionsService.getPlans()
                ]);
                setSolutions(sols);
                setStats(stts);
                setPlans(plns);
            } catch (error) {
                console.error("Failed to fetch hiring solutions data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                                <Sparkles className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Hiring Solutions for Every Business
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                            Find, hire, and onboard top remote talent in Cambodia with our comprehensive hiring platform.
                            Streamline your recruitment process and build your dream team faster.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Link
                                href="/post-job"
                                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                Post a Job
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-3 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-all"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
                        >
                            <DynamicIcon name={stat.icon} className="h-8 w-8 text-primary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Solutions Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Hiring Solutions</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to find and hire the best remote talent in Cambodia
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {solutions.map((solution) => (
                        <div
                            key={solution.title}
                            className="p-8 rounded-xl border border-border bg-card hover:shadow-xl transition-all"
                        >
                            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${solution.bg} mb-6`}>
                                <DynamicIcon name={solution.icon} className={`h-7 w-7 ${solution.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{solution.title}</h3>
                            <p className="text-muted-foreground mb-6">{solution.description}</p>
                            <ul className="space-y-2">
                                {solution.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Flexible pricing options to match your hiring needs and budget
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-2xl border-2 bg-card transition-all hover:shadow-xl ${plan.popular
                                    ? "border-primary shadow-lg scale-105"
                                    : "border-border"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">/{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.name === "Enterprise" ? "/contact" : "/post-job"}
                                    className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${plan.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "border border-border bg-background text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-12 text-center">
                    <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Need Help Choosing the Right Solution?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Our hiring specialists are here to help you find the perfect plan for your business needs.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                    >
                        Talk to an Expert
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
