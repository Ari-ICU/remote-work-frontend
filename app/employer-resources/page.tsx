"use client";

import { useState, useEffect } from "react";
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
    GraduationCap,
    HelpCircle
} from "lucide-react";
import {
    employerResourcesService,
    EmployerResourceCategory,
    EmployerFeaturedGuide,
    EmployerDownloadableResource,
    EmployerFAQ
} from "@/lib/services/employer-resources";

const IconMap: { [key: string]: any } = {
    BookOpen,
    Video,
    FileText,
    Download,
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    CheckCircle2,
    GraduationCap
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] || HelpCircle;
    return <Icon className={className} />;
}

export default function EmployerResourcesPage() {
    const [categories, setCategories] = useState<EmployerResourceCategory[]>([]);
    const [guides, setGuides] = useState<EmployerFeaturedGuide[]>([]);
    const [downloads, setDownloads] = useState<EmployerDownloadableResource[]>([]);
    const [faqs, setFaqs] = useState<EmployerFAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, gds, dls, fqs] = await Promise.all([
                    employerResourcesService.getCategories(),
                    employerResourcesService.getGuides(),
                    employerResourcesService.getDownloads(),
                    employerResourcesService.getFaqs()
                ]);
                setCategories(cats);
                setGuides(gds);
                setDownloads(dls);
                setFaqs(fqs);
            } catch (error) {
                console.error("Failed to fetch employer resources data:", error);
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
                    {categories.map((category) => {
                        return (
                            <div
                                key={category.id}
                                className="p-8 rounded-xl border border-border bg-card hover:shadow-xl transition-all"
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.bg} mb-6`}>
                                    <DynamicIcon name={category.icon} className={`h-7 w-7 ${category.color}`} />
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
                            return (
                                <div
                                    key={guide.id}
                                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${guide.color} flex-shrink-0`}>
                                            <DynamicIcon name={guide.icon} className="h-6 w-6 text-white" />
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
