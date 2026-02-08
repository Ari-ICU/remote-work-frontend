import Link from "next/link";
import {
    BookOpen,
    Video,
    FileText,
    Download,
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    CheckCircle2,
    ArrowRight,
    Newspaper,
    GraduationCap
} from "lucide-react";

export default function EmployerResourcesPage() {
    const resourceCategories = [
        {
            icon: BookOpen,
            title: "Hiring Guides",
            description: "Comprehensive guides to help you hire the best remote talent",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            resources: [
                "Complete Guide to Remote Hiring in Cambodia",
                "How to Write Effective Job Descriptions",
                "Best Practices for Interviewing Remote Candidates",
                "Onboarding Remote Employees Successfully"
            ]
        },
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Step-by-step video guides for using our platform effectively",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            resources: [
                "Getting Started with KhmerWork",
                "How to Post Your First Job",
                "Managing Applications Efficiently",
                "Using Our Messaging System"
            ]
        },
        {
            icon: FileText,
            title: "Templates & Tools",
            description: "Ready-to-use templates and tools to streamline your hiring",
            color: "text-green-500",
            bg: "bg-green-500/10",
            resources: [
                "Job Description Templates",
                "Interview Question Bank",
                "Candidate Evaluation Scorecards",
                "Offer Letter Templates"
            ]
        },
        {
            icon: TrendingUp,
            title: "Market Insights",
            description: "Data-driven insights about the Cambodian job market",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            resources: [
                "2026 Salary Benchmarking Report",
                "Remote Work Trends in Cambodia",
                "Skills in Demand Analysis",
                "Hiring Competition Insights"
            ]
        }
    ];

    const guides = [
        {
            title: "The Ultimate Guide to Remote Hiring",
            description: "Learn everything you need to know about building and managing a successful remote team in Cambodia.",
            category: "Hiring Strategy",
            readTime: "15 min read",
            icon: Users,
            color: "bg-blue-500"
        },
        {
            title: "Crafting Job Posts That Attract Top Talent",
            description: "Discover the secrets to writing compelling job descriptions that stand out and attract qualified candidates.",
            category: "Job Posting",
            readTime: "8 min read",
            icon: Target,
            color: "bg-green-500"
        },
        {
            title: "Effective Remote Interview Techniques",
            description: "Master the art of conducting virtual interviews that help you identify the best candidates for your team.",
            category: "Interviewing",
            readTime: "12 min read",
            icon: Video,
            color: "bg-purple-500"
        },
        {
            title: "Building a Strong Employer Brand",
            description: "Learn how to position your company as an employer of choice in the competitive Cambodian market.",
            category: "Branding",
            readTime: "10 min read",
            icon: Lightbulb,
            color: "bg-orange-500"
        }
    ];

    const downloads = [
        {
            title: "Hiring Checklist",
            description: "A comprehensive checklist to ensure you don't miss any crucial steps in your hiring process.",
            format: "PDF",
            size: "2.4 MB"
        },
        {
            title: "Interview Question Templates",
            description: "Pre-written interview questions for various roles and experience levels.",
            format: "DOCX",
            size: "1.8 MB"
        },
        {
            title: "Salary Benchmarking Guide",
            description: "Detailed salary data for remote positions across different industries in Cambodia.",
            format: "PDF",
            size: "3.2 MB"
        },
        {
            title: "Remote Work Policy Template",
            description: "A customizable template for creating your company's remote work policy.",
            format: "DOCX",
            size: "1.5 MB"
        }
    ];

    const faqs = [
        {
            question: "How do I attract quality candidates to my job postings?",
            answer: "Focus on writing clear, detailed job descriptions that highlight your company culture, benefits, and growth opportunities. Use relevant keywords, be transparent about salary ranges, and respond quickly to applications."
        },
        {
            question: "What's the average time to hire on KhmerWork?",
            answer: "Most employers find qualified candidates within 7-14 days. The timeline depends on factors like job complexity, salary range, and how quickly you review applications. Premium listings typically see faster results."
        },
        {
            question: "How can I verify candidate skills and experience?",
            answer: "We recommend a multi-step verification process: review portfolios, conduct technical assessments, check references, and use video interviews. Our platform also provides skill verification badges for candidates."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept major credit cards (Visa, Mastercard), PayPal, and local payment methods including KHQR. All transactions are secure and processed through encrypted payment gateways."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                                <GraduationCap className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Employer Resources
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                            Everything you need to successfully hire, manage, and retain top remote talent in Cambodia.
                            Access our library of guides, templates, and expert insights.
                        </p>
                    </div>
                </div>
            </div>

            {/* Resource Categories */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {resourceCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={category.title}
                                className="p-8 rounded-xl border border-border bg-card hover:shadow-xl transition-all"
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.bg} mb-6`}>
                                    <Icon className={`h-7 w-7 ${category.color}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">{category.title}</h3>
                                <p className="text-muted-foreground mb-6">{category.description}</p>
                                <ul className="space-y-2">
                                    {category.resources.map((resource) => (
                                        <li key={resource} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{resource}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Featured Guides */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Featured Guides</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            In-depth articles to help you master remote hiring
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {guides.map((guide) => {
                            const Icon = guide.icon;
                            return (
                                <div
                                    key={guide.title}
                                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${guide.color} flex-shrink-0`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold text-primary">{guide.category}</span>
                                                <span className="text-xs text-muted-foreground">• {guide.readTime}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {guide.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                                Read More
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Downloadable Resources */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Downloadable Resources</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Free templates and tools to streamline your hiring process
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {downloads.map((download) => (
                        <div
                            key={download.title}
                            className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all flex items-start gap-4"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-foreground mb-2">{download.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{download.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {download.format} • {download.size}
                                    </span>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                                        <Download className="h-4 w-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Quick answers to common questions from employers
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <div
                                key={faq.question}
                                className="p-6 rounded-xl border border-border bg-card"
                            >
                                <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-12 text-center">
                    <Newspaper className="h-12 w-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Stay Updated with Our Newsletter
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Get the latest hiring tips, market insights, and platform updates delivered to your inbox.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            href="/#newsletter"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                        >
                            Subscribe Now
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
