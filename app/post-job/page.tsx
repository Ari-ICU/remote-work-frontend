"use client";

import { useState, useEffect, useRef } from "react";
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
    Briefcase,
    Wand2,
    TrendingUp
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

import { jobsService } from "@/lib/services/jobs";
import { authService } from "@/lib/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { aiService } from "@/lib/services/ai";
import { toast } from "sonner";

interface Plan {
    id: string;
    name: string;
    price: number | string;
    description: string;
    features: string[];
}

export default function PostJobPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salaryPrediction, setSalaryPrediction] = useState<{ estimated_salary: number, confidence_score: number } | null>(null);
    const [isPredictingSalary, setIsPredictingSalary] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "free";

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get("/pricing/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            }
        };
        fetchPlans();

        // Check if redirected from successful payment
        const success = searchParams.get("success");
        if (success === "true") {
            setIsSubmitted(true);
        }
    }, [searchParams]);


    const [category, setCategory] = useState("");
    const [type, setType] = useState("Full-time");
    const [responsibilities, setResponsibilities] = useState<string[]>([""]);
    const [requirements, setRequirements] = useState<string[]>([""]);
    const [skills, setSkills] = useState("");

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, ""]);
    };

    const removeListItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const updateListItem = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const sectionRefs = {
        1: useRef<HTMLDivElement>(null),
        2: useRef<HTMLDivElement>(null),
        3: useRef<HTMLDivElement>(null),
        4: useRef<HTMLDivElement>(null),
    };

    const scrollToSection = (step: number) => {
        const ref = sectionRefs[step as keyof typeof sectionRefs];
        if (ref.current) {
            const yOffset = -120; // Account for sticky header and spacing
            const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveStep(step);
        }
    };

    useEffect(() => {
        const observers = Object.entries(sectionRefs).map(([step, ref]) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveStep(parseInt(step));
                    }
                },
                { threshold: 0.3, rootMargin: "-100px 0px -40% 0px" }
            );

            if (ref.current) observer.observe(ref.current);
            return observer;
        });

        return () => {
            observers.forEach(o => o.disconnect());
        };
    }, [plans]); // Re-run when plans load as content height changes

    const handleGenerateAIDescription = async () => {
        if (!title || !category) {
            toast.error("Please provide a title and category first!");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await aiService.generateDescription(title, category);
            setDescription(response.description);
            if (response.responsibilities) setResponsibilities(response.responsibilities);
            if (response.requirements) setRequirements(response.requirements);
            toast.success("AI Content generated!", {
                description: "Review and refine the generated details."
            });
        } catch (err) {
            console.error("Failed to generate AI description:", err);
            toast.error("AI Generation failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePredictSalary = async () => {
        if (!skills || !category) {
            toast.error("Please provide skills and category for better prediction.");
            return;
        }

        setIsPredictingSalary(true);
        try {
            const skillList = skills.split(",").map(s => s.trim()).filter(s => s !== "");
            const response = await aiService.predictSalary({
                skills: skillList,
                experience_level: "Intermediate", // Defaulting for prediction
                location: "Remote",
                job_type: type === "Hourly" ? "HOURLY" : "FIXED"
            });
            setSalaryPrediction(response);
            toast.success("Market rate analysis complete!");
        } catch (err) {
            console.error("Failed to predict salary:", err);
        } finally {
            setIsPredictingSalary(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = authService.getCurrentUser();
        if (!user) {
            router.push("/login?redirect=/post-job");
            return;
        }

        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const validSalary = (formData.get("salary") as string).replace(/[^0-9.]/g, '');
        const budget = parseFloat(validSalary) || 0;

        const typeMapping: Record<string, string> = {
            "Full-time": "FIXED",
            "Part-time": "FIXED",
            "Freelance": "FIXED",
            "Hourly": "HOURLY"
        };

        const jobData = {
            title: formData.get("title") as string,
            companyName: formData.get("company") as string,
            location: formData.get("location") as string,
            budgetType: typeMapping[type] || "FIXED",
            budget: budget,
            description: formData.get("description") as string,
            responsibilities: responsibilities.filter(r => r.trim() !== ""),
            requirements: requirements.filter(r => r.trim() !== ""),
            category: category || "General",
            skills: skills.split(",").map(s => s.trim()).filter(s => s !== ""),
            remote: true,
            featured: plan !== "free"
        };

        try {
            // Check if user selected a paid plan
            if (plan !== "free") {
                // Get the selected plan details
                const selectedPlan = plans.find(p =>
                    p.name.toLowerCase() === plan.toLowerCase()
                );

                if (!selectedPlan) {
                    setError("Selected plan not found. Please try again.");
                    return;
                }

                // Save job data to sessionStorage for after payment
                sessionStorage.setItem('pendingJobData', JSON.stringify(jobData));
                sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));

                // Redirect to payment page
                router.push(`/checkout?plan=${plan}&amount=${selectedPlan.price}`);
                return;
            }

            // For free plan, post immediately
            await jobsService.create(jobData);
            setIsSubmitted(true);
        } catch (err: any) {
            const responseData = err.response?.data;
            const message = responseData?.message;

            // Normalize message to string
            const errorMessageString = Array.isArray(message)
                ? message.join(", ")
                : typeof message === 'string'
                    ? message
                    : "Failed to publish job listing. Please try again.";

            console.error("Failed to post job:", err);
            setError(errorMessageString);
        } finally {
            setIsLoading(false);
        }
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
                        <h1 className="text-3xl font-bold text-foreground">
                            {plan === "free" ? "Listing Published!" : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Listing Published!`}
                        </h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {plan === "free"
                                ? "Your remote job listing is now live. We've sent a confirmation email with details on how to manage your post."
                                : `Your ${plan} job listing is now live with enhanced visibility. We've sent a confirmation email with your receipt and post details.`}
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

                            {/* Step Navigation - Interactive */}
                            <div className="hidden md:flex items-center justify-between mb-12 px-4 sticky top-0 py-4 bg-card/80 backdrop-blur-md z-30 -mx-6 md:-mx-12 px-12 border-b border-border/50">
                                {[
                                    { n: 1, label: "Job Details" },
                                    { n: 2, label: "Rates & Type" },
                                    { n: 3, label: "Description" },
                                    { n: 4, label: "Visibility" }
                                ].map((s) => (
                                    <button
                                        key={s.n}
                                        type="button"
                                        onClick={() => scrollToSection(s.n)}
                                        className="flex items-center gap-3 group transition-all"
                                    >
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${activeStep === s.n ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20' : activeStep > s.n ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'}`}>
                                            {activeStep > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeStep === s.n ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {s.label}
                                        </span>
                                        {s.n < 4 && <div className="w-8 lg:w-16 h-px bg-border mx-2" />}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Section 1: Core Info */}
                            <div className="space-y-8 scroll-mt-32" ref={sectionRefs[1]}>
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
                                        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Product Designer" required className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="category" className="text-sm font-semibold">Work Category</Label>
                                        <Select onValueChange={setCategory} required>
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
                                            <Input id="company" name="company" placeholder="e.g. Acme Inc." required className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="skills" className="text-sm font-semibold">Key Skills</Label>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="skills"
                                                name="skills"
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                placeholder="e.g. React, TypeScript, Figma"
                                                required
                                                className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground ml-1">Separate skills with commas</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="location" className="text-sm font-semibold">Remote Location</Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input id="location" name="location" placeholder="e.g. Remote (Global)" required className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Type & Pay */}
                            <div className="space-y-8 scroll-mt-32" ref={sectionRefs[2]}>
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
                                        <Label className="text-sm font-semibold">Contract Style</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: "Full-time", label: "Full-time", icon: "FT" },
                                                { id: "Part-time", label: "Part-time", icon: "PT" },
                                                { id: "Freelance", label: "Freelance", icon: "FL" },
                                                { id: "Hourly", label: "Hourly", icon: "HR" }
                                            ].map((style) => (
                                                <button
                                                    key={style.id}
                                                    type="button"
                                                    onClick={() => setType(style.id)}
                                                    className={`h-14 px-4 rounded-xl border-2 transition-all flex items-center gap-3 overflow-hidden ${type === style.id
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-border/50 bg-muted/10 text-muted-foreground hover:border-primary/30'
                                                        }`}
                                                >
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${type === style.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                        {style.icon}
                                                    </div>
                                                    <span className="text-sm font-bold truncate">{style.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="salary" className="text-sm font-semibold">Salary / Rate Range</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-[10px] font-black uppercase text-primary hover:bg-primary/5 gap-1.5 rounded-lg"
                                                onClick={handlePredictSalary}
                                                disabled={isPredictingSalary}
                                            >
                                                {isPredictingSalary ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <TrendingUp className="h-3 w-3" />
                                                )}
                                                Check Market Rate
                                            </Button>
                                        </div>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                            <Input id="salary" name="salary" placeholder="2,000 - 4,000" required className="pl-8 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                        </div>
                                        {salaryPrediction && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                                    <span className="text-xs font-semibold text-primary">
                                                        AI suggests: ${salaryPrediction.estimated_salary.toLocaleString()} - ${(salaryPrediction.estimated_salary * 1.25).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] font-bold text-primary/60 uppercase">
                                                    {Math.round(salaryPrediction.confidence_score * 100)}% Confidence
                                                </div>
                                            </motion.div>
                                        )}
                                        <p className="text-xs text-muted-foreground italic">Specify monthly range for full-time or hourly rate for freelance.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Detailed Desc */}
                            <div className="space-y-8 scroll-mt-32" ref={sectionRefs[3]}>
                                <div>
                                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-foreground">Detailed Description</h2>
                                                <p className="text-sm text-muted-foreground">Highlight the exciting parts of the role</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 gap-2 rounded-xl border border-primary/20"
                                            onClick={handleGenerateAIDescription}
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Wand2 className="h-4 w-4" />
                                            )}
                                            {isGenerating ? "AI Thinking..." : "Generate with AI"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label htmlFor="description" className="text-sm font-semibold">Overview & Context</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Introduce your company and the core mission of this role..."
                                            className="min-h-[150px] rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all p-6 resize-none leading-relaxed"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Responsibilities */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold">Key Responsibilities</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-[10px] font-black uppercase text-primary"
                                                    onClick={() => addListItem(setResponsibilities)}
                                                >
                                                    + Add Task
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {responsibilities.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <Input
                                                            value={item}
                                                            onChange={(e) => updateListItem(idx, e.target.value, setResponsibilities)}
                                                            placeholder="e.g. Architect the next version of..."
                                                            className="h-10 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                        />
                                                        {responsibilities.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                                                                onClick={() => removeListItem(idx, setResponsibilities)}
                                                            >
                                                                <Info className="h-4 w-4 rotate-45" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold">Candidate Requirements</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-[10px] font-black uppercase text-primary"
                                                    onClick={() => addListItem(setRequirements)}
                                                >
                                                    + Add Req
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {requirements.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <Input
                                                            value={item}
                                                            onChange={(e) => updateListItem(idx, e.target.value, setRequirements)}
                                                            placeholder="e.g. 5+ years experience in..."
                                                            className="h-10 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                        />
                                                        {requirements.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                                                                onClick={() => removeListItem(idx, setRequirements)}
                                                            >
                                                                <Info className="h-4 w-4 rotate-45" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 p-4 bg-muted/20 border border-border/30 rounded-xl mt-4">
                                        <Loader2 className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Tip: Clear lists for responsibilities and requirements help candidates self-filter, saving you time in the long run.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Visibility Plan */}
                            <div className="space-y-8 scroll-mt-32" ref={sectionRefs[4]}>
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Visibility Plan</h2>
                                        <p className="text-sm text-muted-foreground">Boost your listing to reach more candidates</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {plans.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.set('plan', p.name.toLowerCase() === 'free' ? 'free' : p.name.toLowerCase());
                                                router.replace(`?${params.toString()}`, { scroll: false });
                                            }}
                                            className={`flex flex-col p-5 rounded-2xl border-2 transition-all text-left group ${plan === (p.name.toLowerCase() === 'free' ? 'free' : p.name.toLowerCase())
                                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                                : 'border-border hover:border-primary/30 hover:bg-muted/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-bold ${plan === (p.name.toLowerCase() === 'free' ? 'free' : p.name.toLowerCase()) ? 'text-primary' : 'text-muted-foreground'}`}>
                                                    {p.name}
                                                </span>
                                                {plan === (p.name.toLowerCase() === 'free' ? 'free' : p.name.toLowerCase()) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                            </div>
                                            <div className="text-2xl font-black mb-1">{typeof p.price === 'number' ? `$${p.price}` : p.price}</div>
                                            <div className="text-xs text-muted-foreground leading-snug">{p.description}</div>
                                        </button>
                                    ))}
                                </div>
                                {plan !== 'free' && (
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                        <p className="text-sm font-medium text-primary">
                                            {plan === 'featured'
                                                ? "Featured badge, 2x visibility in search, and priority support included."
                                                : "Homepage spot, top of category, extended duration, and dedicated account manager included."
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Section */}
                            <div className="pt-8 border-t border-border mt-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                                            {plan === "free" ? "Free for limited time" : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {plan === "free"
                                                ? "Your listing will be live for 30 days."
                                                : plan === "featured"
                                                    ? "Boost visibility and get more quality applicants."
                                                    : "Maximum exposure for critical hires."}
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto min-w-[240px] h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin" />
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
