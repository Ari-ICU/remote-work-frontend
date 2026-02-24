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
    Check,
    Sparkles,
    Wand2
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
import { aiService } from "@/lib/services/ai";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ApplyPage() {
    const t = useTranslations("apply");
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");

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
        setFormError(null);
        try {
            const formData = new FormData(e.currentTarget);

            const applicationData = {
                fullname: formData.get("fullname") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                coverLetter: formData.get("coverLetter") as string,
                proposedRate: formData.get("proposedRate") as string,
                estimatedTime: formData.get("estimatedTime") as string
            };

            const clientEmail = job?.companyEmail || "employer@khmerwork.com";
            const subject = encodeURIComponent(`Application for ${job?.title} - ${applicationData.fullname}`);
            const body = encodeURIComponent(`
                Hello,

                I am applying for the position of ${job?.title}.

                Applicant Details:
                - Name: ${applicationData.fullname}
                - Email: ${applicationData.email}
                - Phone: ${applicationData.phone}
                - Proposed Rate: $${applicationData.proposedRate}
                - Estimated Time: ${applicationData.estimatedTime}

                Cover Letter:
                ${applicationData.coverLetter}
            `.trim());

            const backendData = {
                coverLetter: `Applicant: ${applicationData.fullname} | Email: ${applicationData.email} | Phone: ${applicationData.phone}\n\n${applicationData.coverLetter}`,
                proposedRate: parseFloat(applicationData.proposedRate) || 0,
                estimatedTime: applicationData.estimatedTime || "Not specified"
            };

            await applicationService.apply(params.id as string, backendData);

            // Open user's email client directly only after successful backend save
            window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;

            setIsSuccess(true);
        } catch (err: any) {
            console.error("Failed to submit application:", err.response?.data || err);
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
            const finalMessage = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
            toast.error(finalMessage);
            setFormError(finalMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateAIProposal = async () => {
        if (!job) return;
        const user = authService.getCurrentUser();
        if (!user) {
            toast.error("Please login to use AI features");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await aiService.generateProposal({
                job_title: job.title,
                job_description: job.description || "",
                user_skills: user.skills || [],
                user_bio: user.bio || ""
            });
            setCoverLetter(response.proposal);
            toast.success(t("aiSuccess"), {
                description: t("aiSuccessDesc")
            });
        } catch (err) {
            console.error("Failed to generate AI proposal:", err);
            toast.error(t("aiFailed"));
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">{t("loading")}</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-destructive font-bold text-xl">{error || t("jobNotFound")}</p>
                    <Button asChild variant="outline">
                        <Link href="/jobs">{t("browseMoreJobs")}</Link>
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
                        <h1 className="text-3xl font-bold text-foreground">{t("applicationSent")}</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {t("applicationSentDesc")}
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20" asChild>
                                <Link href={`/jobs/${job?.id}`} replace>{t("returnToJob")}</Link>
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" asChild>
                                <Link href="/jobs" replace>{t("browseMoreJobs")}</Link>
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
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            {t("backToJob")}
                        </button>
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
                                            <h2 className="text-xl font-semibold">{t("jobDescription")}</h2>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {job.description || t("noDescription")}
                                            </p>
                                        </div>

                                        {job.responsibilities && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-semibold">{t("keyResponsibilities")}</h2>
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
                                                <h2 className="text-xl font-semibold">{t("requirements")}</h2>
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
                                        <h3 className="font-semibold text-lg">{t("applyForPosition")}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{t("fillOutForm")}</p>
                                    </div>
                                    <div className="p-6">
                                        {formError && (
                                            <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                                                {formError}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullname">{t("fullName")}</Label>
                                                    <Input id="fullname" name="fullname" placeholder={t("placeholderName")} required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">{t("emailAddress")}</Label>
                                                    <Input id="email" name="email" type="email" placeholder={t("placeholderEmail")} required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                                                    <Input id="phone" name="phone" type="tel" placeholder="+855 12 345 678" required className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="coverLetter">{t("coverLetter")}</Label>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 gap-1.5 rounded-lg"
                                                            onClick={handleGenerateAIProposal}
                                                            disabled={isGenerating}
                                                        >
                                                            {isGenerating ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Wand2 className="h-3 w-3" />
                                                            )}
                                                            {isGenerating ? t("generating") : t("draftWithAI")}
                                                        </Button>
                                                    </div>
                                                    <Textarea
                                                        id="coverLetter"
                                                        name="coverLetter"
                                                        placeholder={t("placeholderCoverLetter")}
                                                        className="rounded-xl min-h-[120px] transition-all focus:ring-2 focus:ring-primary/20"
                                                        value={coverLetter}
                                                        onChange={(e) => setCoverLetter(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="resume">{t("resume")}</Label>
                                                    <Input id="resume" name="resume" type="file" required className="rounded-xl cursor-pointer" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="proposedRate">{t("proposedRate")}</Label>
                                                        <Input id="proposedRate" name="proposedRate" type="number" min="0" step="0.01" placeholder="50.00" required className="rounded-xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="estimatedTime">{t("estimatedTime")}</Label>
                                                        <Input id="estimatedTime" name="estimatedTime" placeholder={t("placeholderTime")} className="rounded-xl" />
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
                                                        {t("sending")}
                                                    </div>
                                                ) : (
                                                    t("submitApplication")
                                                )}
                                            </Button>

                                            <p className="text-xs text-center text-muted-foreground">
                                                {t("terms")}
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
