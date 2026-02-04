"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    DollarSign,
    MapPin,
    Type,
    Building2,
    CheckCircle2,
    Sparkles,
    Info,
    Calendar,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { fadeIn, scaleUp, staggerContainer } from "@/lib/animations";

export default function PostJobPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submission
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={scaleUp}
                        className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-border bg-card shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Listing Published!</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Your remote job listing is now live. We&apos;ve sent a confirmation email with details on how to manage your post.
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20" asChild>
                                <Link href="/">Return to Marketplace</Link>
                            </Button>
                            <Button variant="ghost" onClick={() => setIsSubmitted(false)}>
                                Post Another Role
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Modern Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden bg-primary">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent)]" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-24 -right-24 w-96 h-96 border border-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-12 left-1/4 w-64 h-64 border border-white/5 rounded-full"
                        />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center md:text-left"
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-8 group"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Marketplace
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                                Find your next <span className="text-primary-foreground/80 italic">expert</span> teammate
                            </h1>
                            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed">
                                Connect with the best remote and freelance talent in Cambodia. Simple pricing, high-quality candidates.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Clean Form UI */}
                <section className="container mx-auto px-4 max-w-4xl -mt-16 pb-24 relative z-20">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                        className="bg-card border border-border rounded-[2rem] shadow-2xl p-6 md:p-12"
                    >
                        <form onSubmit={handleSubmit} className="space-y-12">

                            {/* Step Navigation - Visual Only */}
                            <div className="hidden md:flex items-center justify-between mb-12 px-4">
                                {[
                                    { n: 1, label: "Job Details" },
                                    { n: 2, label: "Rates & Type" },
                                    { n: 3, label: "Description" }
                                ].map((s) => (
                                    <div key={s.n} className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${activeStep >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {s.n}
                                        </div>
                                        <span className={`text-sm font-medium ${activeStep >= s.n ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {s.label}
                                        </span>
                                        {s.n < 3 && <div className="w-12 h-px bg-border mx-2" />}
                                    </div>
                                ))}
                            </div>

                            {/* Section 1: Core Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Core Information</h2>
                                        <p className="text-sm text-muted-foreground">Tell us the basics about the role</p>
                                    </div>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="title" className="text-sm font-semibold">Listing Title</Label>
                                        <Input id="title" placeholder="e.g. Senior Product Designer" required className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="category" className="text-sm font-semibold">Work Category</Label>
                                        <Select required>
                                            <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                                                <SelectValue placeholder="Select talent area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dev">Software Engineering</SelectItem>
                                                <SelectItem value="design">Creative & Design</SelectItem>
                                                <SelectItem value="marketing">Growth & Marketing</SelectItem>
                                                <SelectItem value="content">Content & Writing</SelectItem>
                                                <SelectItem value="ops">Operations & Support</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="company" className="text-sm font-semibold">Company Name</Label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input id="company" placeholder="e.g. Acme Inc." required className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="location" className="text-sm font-semibold">Remote Location</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input id="location" placeholder="e.g. Remote (Global)" required className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Type & Pay */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Type & Compensation</h2>
                                        <p className="text-sm text-muted-foreground">Select the contract type and pay range</p>
                                    </div>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="type" className="text-sm font-semibold">Contract Style</Label>
                                        <Select required>
                                            <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                                                <SelectValue placeholder="How will they work?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="remote-full">Full-time Remote</SelectItem>
                                                <SelectItem value="remote-part">Part-time Remote</SelectItem>
                                                <SelectItem value="freelance">Freelance / Contract</SelectItem>
                                                <SelectItem value="hourly">Hourly Billing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="salary" className="text-sm font-semibold">Salary / Rate Range</Label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                            <Input id="salary" placeholder="2,000 - 4,000" required className="pl-8 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">Specify monthly range for full-time or hourly rate for freelance.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Detailed Desc */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Detailed Description</h2>
                                        <p className="text-sm text-muted-foreground">Highlight the exciting parts of the role</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label htmlFor="description" className="text-sm font-semibold">Role & Requirements</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="We're looking for a person who... 

Expected skills:
- Skill 1
- Skill 2"
                                        className="min-h-[250px] rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all p-6 resize-none leading-relaxed"
                                        required
                                    />
                                    <div className="flex items-start gap-2 p-4 bg-muted/20 border border-border/30 rounded-xl">
                                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Tip: Clear and detailed descriptions get 3x more relevant applicants. Be specific about the tools you use and your company culture.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold">Branding (Optional)</Label>
                                    <label
                                        htmlFor="logo-upload"
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/50 rounded-2xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all group overflow-hidden"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="p-3 bg-muted rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="mb-1 text-sm font-medium">Click to upload company logo</p>
                                            <p className="text-xs text-muted-foreground">PNG or JPEG up to 5MB</p>
                                        </div>
                                        <input id="logo-upload" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Section */}
                            <div className="pt-8 border-t border-border mt-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">Free for limited time</p>
                                        <p className="text-sm text-muted-foreground mt-1">Your listing will be live for 30 days.</p>
                                    </div>
                                    <Button
                                        type="submit"
                                        // size="xl" 
                                        className="w-full md:w-auto min-w-[240px] h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Publishing Listing...</span>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Post Job Listing <CheckCircle2 className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </section>
            </main>

            {/* Simple Footer Subtext */}
            <footer className="py-12 border-t border-border bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Questions? Contact our hiring support at <Link href="#" className="text-primary hover:underline">employers@khmerwork.com</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
