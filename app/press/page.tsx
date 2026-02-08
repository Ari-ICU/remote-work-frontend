import Link from "next/link";
import { Newspaper, Calendar, Download, ArrowRight, FileText, Award } from "lucide-react";

export default function PressPage() {
    const pressReleases = [
        {
            title: "KhmerWork Reaches 15,000 Successful Job Placements Milestone",
            date: "February 1, 2026",
            excerpt: "Leading Cambodian remote work platform celebrates major achievement in connecting employers with top freelance talent across Southeast Asia.",
            category: "Company News",
            featured: true
        },
        {
            title: "KhmerWork Launches AI-Powered Candidate Matching System",
            date: "January 15, 2026",
            excerpt: "New technology reduces time-to-hire by 60% and improves candidate-job fit accuracy to 94%, revolutionizing the hiring process for Cambodian businesses.",
            category: "Product Launch",
            featured: false
        },
        {
            title: "Partnership Announcement: KhmerWork and Cambodia Digital Economy Agency",
            date: "December 20, 2025",
            excerpt: "Strategic collaboration aims to promote digital skills development and remote work opportunities for Cambodian youth.",
            category: "Partnership",
            featured: false
        },
        {
            title: "KhmerWork Recognized as 'Best Remote Work Platform' at Cambodia Tech Awards 2025",
            date: "November 30, 2025",
            excerpt: "Platform receives prestigious award for innovation in connecting Cambodian talent with global opportunities.",
            category: "Awards",
            featured: false
        },
        {
            title: "KhmerWork Expands Services to Include Freelance Payment Solutions",
            date: "November 10, 2025",
            excerpt: "New integrated payment system supports multiple currencies and local payment methods, making it easier for employers to pay freelancers.",
            category: "Product Launch",
            featured: false
        },
        {
            title: "Study: Remote Work Opportunities in Cambodia Grow 45% Year-Over-Year",
            date: "October 25, 2025",
            excerpt: "KhmerWork releases comprehensive market research report highlighting the rapid growth of Cambodia's remote work economy.",
            category: "Research",
            featured: false
        }
    ];

    const mediaKit = [
        {
            title: "Company Logo Pack",
            description: "High-resolution logos in various formats (PNG, SVG, EPS)",
            size: "4.2 MB",
            icon: FileText
        },
        {
            title: "Brand Guidelines",
            description: "Complete brand identity guidelines and usage instructions",
            size: "2.8 MB",
            icon: FileText
        },
        {
            title: "Press Kit 2026",
            description: "Company overview, statistics, and executive bios",
            size: "3.5 MB",
            icon: FileText
        },
        {
            title: "Product Screenshots",
            description: "High-quality screenshots of our platform features",
            size: "8.1 MB",
            icon: FileText
        }
    ];

    const awards = [
        {
            title: "Best Remote Work Platform",
            organization: "Cambodia Tech Awards",
            year: "2025",
            icon: Award
        },
        {
            title: "Innovation in HR Technology",
            organization: "Southeast Asia Startup Summit",
            year: "2025",
            icon: Award
        },
        {
            title: "Top 10 Cambodian Startups",
            organization: "TechCrunch Asia",
            year: "2024",
            icon: Award
        },
        {
            title: "Best Employer Platform",
            organization: "Digital Cambodia Awards",
            year: "2024",
            icon: Award
        }
    ];

    const mediaContact = {
        name: "Media Relations Team",
        email: "press@khmerwork.com",
        phone: "+855 23 xxx xxx"
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                                <Newspaper className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Press & Media
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                            Latest news, press releases, and media resources about KhmerWork.
                            For media inquiries, please contact our press team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Press Release */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {pressReleases
                    .filter((release) => release.featured)
                    .map((release) => (
                        <div
                            key={release.title}
                            className="mb-16 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 lg:p-12"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                    FEATURED
                                </span>
                                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                    {release.category}
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                {release.title}
                            </h2>
                            <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">{release.date}</span>
                            </div>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                {release.excerpt}
                            </p>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group">
                                Read Full Release
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}

                {/* Press Releases Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-8">Recent Press Releases</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pressReleases
                            .filter((release) => !release.featured)
                            .map((release) => (
                                <article
                                    key={release.title}
                                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                            {release.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {release.date}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {release.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {release.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                        Read More
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </article>
                            ))}
                    </div>
                </div>
            </div>

            {/* Awards & Recognition */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Awards & Recognition</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We're honored to be recognized for our contribution to Cambodia's digital economy
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {awards.map((award) => {
                            const Icon = award.icon;
                            return (
                                <div
                                    key={award.title}
                                    className="p-6 rounded-xl border border-border bg-card text-center hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">{award.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-1">{award.organization}</p>
                                    <p className="text-xs text-muted-foreground">{award.year}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Media Kit */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Media Kit</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Download our brand assets, logos, and press materials
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {mediaKit.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all flex items-start gap-4"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{item.size}</span>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Media Contact */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Media Inquiries</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            For press inquiries, interviews, or additional information, please contact our media relations team
                        </p>
                        <div className="inline-block p-8 rounded-2xl border border-border bg-card text-left">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Contact</div>
                                    <div className="text-lg font-semibold text-foreground">{mediaContact.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                                    <a
                                        href={`mailto:${mediaContact.email}`}
                                        className="text-lg font-semibold text-primary hover:underline"
                                    >
                                        {mediaContact.email}
                                    </a>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Phone</div>
                                    <a
                                        href={`tel:${mediaContact.phone}`}
                                        className="text-lg font-semibold text-foreground hover:text-primary"
                                    >
                                        {mediaContact.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
