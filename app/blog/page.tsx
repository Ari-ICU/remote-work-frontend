import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, TrendingUp, Newspaper } from "lucide-react";

export default function BlogPage() {
    const featuredPost = {
        title: "The Future of Remote Work in Cambodia: Trends and Predictions for 2026",
        excerpt: "Explore how the remote work landscape is evolving in Cambodia and what it means for employers and freelancers. We analyze market trends, salary expectations, and the skills that will be in highest demand.",
        author: "Sarah Chen",
        date: "February 5, 2026",
        readTime: "8 min read",
        category: "Industry Insights",
        image: "🚀",
        featured: true
    };

    const blogPosts = [
        {
            title: "10 Tips for Writing Job Descriptions That Attract Top Talent",
            excerpt: "Learn how to craft compelling job postings that stand out and attract qualified candidates in the competitive Cambodian market.",
            author: "David Kim",
            date: "February 1, 2026",
            readTime: "6 min read",
            category: "Hiring Tips",
            image: "📝"
        },
        {
            title: "How to Successfully Onboard Remote Employees",
            excerpt: "A comprehensive guide to creating an effective onboarding process for your remote team members, ensuring they feel welcome and productive from day one.",
            author: "Lisa Nguyen",
            date: "January 28, 2026",
            readTime: "10 min read",
            category: "Remote Work",
            image: "👥"
        },
        {
            title: "Salary Negotiation Strategies for Freelancers",
            excerpt: "Master the art of negotiating fair compensation as a freelancer. Learn proven strategies to confidently discuss rates with potential clients.",
            author: "Michael Tan",
            date: "January 25, 2026",
            readTime: "7 min read",
            category: "Career Advice",
            image: "💰"
        },
        {
            title: "The Rise of Tech Jobs in Cambodia: A 2026 Analysis",
            excerpt: "Discover which tech roles are seeing the highest growth in Cambodia and what skills employers are looking for in the current market.",
            author: "Sarah Chen",
            date: "January 22, 2026",
            readTime: "9 min read",
            category: "Industry Insights",
            image: "💻"
        },
        {
            title: "Building a Strong Personal Brand as a Freelancer",
            excerpt: "Stand out in the crowded freelance marketplace by developing a compelling personal brand that attracts high-quality clients.",
            author: "Emma Wilson",
            date: "January 18, 2026",
            readTime: "8 min read",
            category: "Career Advice",
            image: "⭐"
        },
        {
            title: "Remote Team Management: Best Practices for 2026",
            excerpt: "Effective strategies for managing distributed teams, maintaining productivity, and fostering a positive remote work culture.",
            author: "David Kim",
            date: "January 15, 2026",
            readTime: "11 min read",
            category: "Management",
            image: "🎯"
        },
        {
            title: "Understanding Cambodia's Freelance Economy",
            excerpt: "An in-depth look at the growth of freelancing in Cambodia, including statistics, trends, and opportunities for both workers and businesses.",
            author: "Lisa Nguyen",
            date: "January 12, 2026",
            readTime: "12 min read",
            category: "Industry Insights",
            image: "📊"
        },
        {
            title: "Essential Tools for Remote Workers in 2026",
            excerpt: "A curated list of the best productivity tools, communication platforms, and resources every remote worker should know about.",
            author: "Michael Tan",
            date: "January 8, 2026",
            readTime: "6 min read",
            category: "Tools & Resources",
            image: "🛠️"
        },
        {
            title: "How to Stand Out in Job Applications",
            excerpt: "Expert tips on creating applications that get noticed by employers, from crafting the perfect cover letter to showcasing your portfolio.",
            author: "Emma Wilson",
            date: "January 5, 2026",
            readTime: "7 min read",
            category: "Career Advice",
            image: "✨"
        }
    ];

    const categories = [
        "All Posts",
        "Industry Insights",
        "Hiring Tips",
        "Career Advice",
        "Remote Work",
        "Management",
        "Tools & Resources"
    ];

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
                            KhmerWork Blog
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                            Insights, tips, and stories about remote work, hiring, and the future of work in Cambodia.
                            Stay informed with expert advice and industry trends.
                        </p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${category === "All Posts"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Post */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">Featured Article</span>
                    </div>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all">
                        <div className="p-8 lg:p-12">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                    {featuredPost.category}
                                </span>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {featuredPost.date}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {featuredPost.readTime}
                                </div>
                            </div>
                            <div className="text-6xl mb-6">{featuredPost.image}</div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{featuredPost.author}</div>
                                        <div className="text-xs text-muted-foreground">Senior Writer</div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group">
                                    Read Article
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.title}
                                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="text-5xl mb-4">{post.image}</div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                            {post.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-foreground">{post.author}</div>
                                                <div className="text-xs text-muted-foreground">{post.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                    <button className="px-8 py-3 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-all">
                        Load More Articles
                    </button>
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-muted/30 border-y border-border">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Never Miss an Update
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Subscribe to our newsletter and get the latest articles delivered to your inbox.
                        </p>
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
