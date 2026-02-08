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
    Award
} from "lucide-react";

export default function HiringSolutionsPage() {
    const solutions = [
        {
            icon: Target,
            title: "Targeted Talent Matching",
            description: "Our AI-powered algorithm matches you with the most qualified candidates based on your specific requirements, skills needed, and company culture.",
            features: [
                "Smart candidate recommendations",
                "Skills-based matching",
                "Cultural fit assessment",
                "Automated screening"
            ],
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            icon: Zap,
            title: "Fast Hiring Process",
            description: "Reduce your time-to-hire by up to 60% with our streamlined recruitment process and pre-vetted talent pool.",
            features: [
                "Pre-screened candidates",
                "Quick application reviews",
                "Instant messaging",
                "Rapid onboarding"
            ],
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        {
            icon: Shield,
            title: "Quality Assurance",
            description: "Every candidate is thoroughly vetted to ensure they meet our high standards for skills, professionalism, and reliability.",
            features: [
                "Skill verification",
                "Background checks",
                "Portfolio reviews",
                "Reference validation"
            ],
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            icon: Users,
            title: "Dedicated Support",
            description: "Get personalized assistance from our hiring specialists who understand the Cambodian market and remote work dynamics.",
            features: [
                "Personal account manager",
                "24/7 customer support",
                "Hiring consultation",
                "Onboarding assistance"
            ],
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ];

    const plans = [
        {
            name: "Starter",
            price: "$99",
            period: "per job posting",
            description: "Perfect for small businesses and startups",
            features: [
                "1 active job posting",
                "30-day listing duration",
                "Basic candidate matching",
                "Email support",
                "Standard job visibility",
                "Application tracking"
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Professional",
            price: "$249",
            period: "per month",
            description: "Ideal for growing companies with regular hiring needs",
            features: [
                "5 active job postings",
                "60-day listing duration",
                "Advanced AI matching",
                "Priority support",
                "Featured job listings",
                "Candidate analytics",
                "Custom branding",
                "Interview scheduling tools"
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "contact us",
            description: "For large organizations with extensive hiring requirements",
            features: [
                "Unlimited job postings",
                "Extended listing duration",
                "Dedicated account manager",
                "24/7 priority support",
                "Premium job placement",
                "Advanced analytics dashboard",
                "Custom integrations",
                "Bulk hiring tools",
                "White-label options",
                "API access"
            ],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    const stats = [
        { label: "Active Employers", value: "2,500+", icon: Users },
        { label: "Successful Hires", value: "15,000+", icon: CheckCircle2 },
        { label: "Average Time to Hire", value: "7 days", icon: Clock },
        { label: "Satisfaction Rate", value: "94%", icon: Award },
    ];

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
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="text-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
                            >
                                <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        );
                    })}
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
                    {solutions.map((solution) => {
                        const Icon = solution.icon;
                        return (
                            <div
                                key={solution.title}
                                className="p-8 rounded-xl border border-border bg-card hover:shadow-xl transition-all"
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${solution.bg} mb-6`}>
                                    <Icon className={`h-7 w-7 ${solution.color}`} />
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
                        );
                    })}
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
