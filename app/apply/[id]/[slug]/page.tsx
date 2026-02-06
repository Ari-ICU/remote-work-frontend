"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    CheckCircle2,
    Building2,
    MapPin,
    DollarSign,
    Briefcase,
    Mail,
    User,
    Phone,
    Linkedin,
    Globe,
    Clock,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { Job } from "@/types/job";
import { jobsService } from "@/lib/services/jobs";
import { applicationService } from "@/lib/services/application";
import { authService } from "@/lib/services/auth";
import { fadeIn, scaleUp } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            if (params.id) {
                try {
                    setIsLoading(true);
                    const foundJob = await jobsService.getById(params.id as string);
                    setJob(foundJob);
                } catch (err) {
                    console.error("Failed to fetch job:", err);
                    setError("Could not find the job you're looking for.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchJob();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = authService.getCurrentUser();
        if (!user) {
            router.push(`/login?redirect=/apply/${params.id}/${params.slug}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData(e.currentTarget);
            const applicationData = {
                coverLetter: formData.get("coverLetter") as string,
                proposedRate: parseFloat(formData.get("proposedRate") as string),
                estimatedTime: formData.get("estimatedTime") as string
            };

            await applicationService.apply(params.id as string, applicationData);
            setIsSuccess(true);
        } catch (err) {
            console.error("Failed to submit application:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-destructive font-bold text-xl">{error || "Job not found"}</p>
                    <Button asChild variant="outline">
                        <Link href="/">Back to Jobs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
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
                        <h1 className="text-3xl font-bold text-foreground">Application Sent!</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Your application for <span className="text-foreground font-semibold">{job?.title}</span> at <span className="text-foreground font-semibold">{job?.company}</span> has been submitted successfully. Good luck!
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20" asChild>
                                <Link href="/">Return to Jobs</Link>
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

            <main className="flex-1 py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Job Listing
                        </Link>
                    </motion.div>

                    {job && (
                        <div className="grid gap-8 lg:grid-cols-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-2 space-y-8"
                            >
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                                {job.title}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                    <span className="font-medium text-foreground">{job.company}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    {job.posted}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-xl font-bold text-primary">
                                                {job.salary}
                                            </div>
                                            <Badge variant="secondary">{job.type}</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold">Job Description</h2>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {job.description || "No description provided."}
                                            </p>
                                        </div>

                                        {job.responsibilities && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-semibold">Key Responsibilities</h2>
                                                <ul className="space-y-3">
                                                    {job.responsibilities.map((item: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {job.requirements && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-semibold">Requirements</h2>
                                                <ul className="space-y-3">
                                                    {job.requirements.map((item: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                                            <Check className="h-5 w-5 text-primary shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden sticky top-24">
                                    <div className="bg-muted/30 p-6 border-b border-border">
                                        <h3 className="font-semibold text-lg">Apply for this position</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Fill out the form below</p>
                                    </div>
                                    <div className="p-6">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullname">Full Name</Label>
                                                    <Input id="fullname" name="fullname" placeholder="John Doe" required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input id="phone" name="phone" type="tel" placeholder="+855 12 345 678" required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="coverLetter">Cover Letter</Label>
                                                    <Textarea
                                                        id="coverLetter"
                                                        name="coverLetter"
                                                        placeholder="Tell the employer why you're a good fit..."
                                                        className="rounded-xl min-h-[120px]"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="resume">Resume/CV</Label>
                                                    <Input id="resume" name="resume" type="file" required className="rounded-xl cursor-pointer" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="proposedRate">Proposed Rate ($)</Label>
                                                        <Input id="proposedRate" name="proposedRate" type="number" min="0" step="0.01" placeholder="50.00" required className="rounded-xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="estimatedTime">Estimated Time</Label>
                                                        <Input id="estimatedTime" name="estimatedTime" placeholder="e.g. 2 weeks" className="rounded-xl" />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Sending...
                                                    </div>
                                                ) : (
                                                    "Submit Application"
                                                )}
                                            </Button>

                                            <p className="text-xs text-center text-muted-foreground">
                                                By submitting, you agree to our Terms of Service and Privacy Policy.
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
