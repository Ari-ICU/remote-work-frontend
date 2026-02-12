"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User, Download, ExternalLink, Loader2, Star, CheckCircle2, XCircle, Sparkles, Wand2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { applicationService } from "@/lib/services/application";
import { jobsService } from "@/lib/services/jobs";
import { aiService } from "@/lib/services/ai";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function JobApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [interviewQuestions, setInterviewQuestions] = useState<Record<string, string[]>>({});
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<Record<string, boolean>>({});

    const loadData = async () => {
        if (!params.id) return;
        try {
            const jobData = await jobsService.getById(params.id as string);
            setJob(jobData);

            const appsData = await applicationService.getForJob(params.id as string);
            setApplications(appsData);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [params.id]);

    const handleStartChat = (applicantId: string) => {
        // Navigate to messages with pre-selected use logic
        // We'll need to implement the "auto-select" in /messages based on URL param
        router.push(`/messages?userId=${applicantId}`);
    };

    const handleAccept = async (appId: string) => {
        toast("Accept this application?", {
            description: "This will hire the freelancer and close the job to other applicants.",
            action: {
                label: "Hire Now",
                onClick: () => {
                    toast.promise(applicationService.accept(appId), {
                        loading: 'Hiring freelancer...',
                        success: () => {
                            loadData();
                            return 'Freelancer hired successfully!';
                        },
                        error: (err) => {
                            console.error("Failed to accept application:", err);
                            return 'Failed to accept application. Please try again.';
                        }
                    });
                }
            },
        });
    };

    const handleReject = async (appId: string) => {
        toast("Reject this application?", {
            action: {
                label: "Reject",
                onClick: () => {
                    toast.promise(applicationService.reject(appId), {
                        loading: 'Rejecting application...',
                        success: () => {
                            loadData();
                            return 'Application rejected.';
                        },
                        error: (err) => {
                            console.error("Failed to reject application:", err);
                            return 'Failed to reject application.';
                        }
                    });
                }
            },
        });
    };

    const handleGenerateQuestions = async (appId: string, applicant: any) => {
        if (!job) return;

        setIsGeneratingQuestions(prev => ({ ...prev, [appId]: true }));
        try {
            const data = await aiService.generateInterviewQuestions({
                job_title: job.title,
                job_description: job.description,
                candidate_skills: applicant.skills || [],
                candidate_bio: applicant.bio
            });
            setInterviewQuestions(prev => ({ ...prev, [appId]: data.questions }));
            toast.success("Tailored interview questions generated!");
        } catch (error) {
            console.error("Failed to generate questions:", error);
            toast.error("Failed to generate questions. Please try again.");
        } finally {
            setIsGeneratingQuestions(prev => ({ ...prev, [appId]: false }));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
                                <p className="text-muted-foreground mt-1 text-lg">
                                    Manage candidates for <span className="font-semibold text-foreground">{job?.title}</span>
                                </p>
                            </div>
                            <Badge variant="outline" className="text-sm py-1 px-3">
                                {applications.length} Applicants
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {applications.length === 0 ? (
                            <div className="bg-card border border-border rounded-xl p-16 text-center shadow-sm">
                                <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                    <User className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-semibold">No applications yet</h3>
                                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                    Applicants will appear here once they start applying to your job.
                                </p>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={app.id}
                                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Applicant Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14 border border-border shadow-sm">
                                                        <AvatarImage src={app.applicant.avatar} />
                                                        <AvatarFallback className="text-lg bg-primary/5 text-primary font-medium">
                                                            {app.applicant.firstName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-bold tracking-tight text-foreground">
                                                                {app.applicant.firstName} {app.applicant.lastName}
                                                            </h3>
                                                            {app.aiMatchScore ? (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={cn(
                                                                        "gap-1 px-2 py-0.5 border",
                                                                        app.aiMatchScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                            app.aiMatchScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                                "bg-muted text-muted-foreground border-border"
                                                                    )}
                                                                >
                                                                    <Sparkles className={cn(
                                                                        "w-3 h-3",
                                                                        app.aiMatchScore >= 80 ? "fill-emerald-700" :
                                                                            app.aiMatchScore >= 50 ? "fill-amber-700" : ""
                                                                    )} />
                                                                    {app.aiMatchScore}% AI Match
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed">
                                                                    No score yet
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground text-sm mt-0.5 line-clamp-1">
                                                            {app.applicant.bio || "Freelancer"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <div className="font-bold text-xl text-foreground">
                                                        ${app.proposedRate}<span className="text-sm text-muted-foreground font-normal">/hr</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">Proposed Rate</div>
                                                </div>
                                            </div>

                                            {/* Proposed Rate for Mobile */}
                                            <div className="sm:hidden mb-4 flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50">
                                                <span className="text-sm font-medium text-muted-foreground">Proposed Rate</span>
                                                <span className="text-lg font-bold text-foreground">${app.proposedRate}/hr</span>
                                            </div>

                                            <div className="bg-muted/30 rounded-2xl p-5 mb-4 border border-border/40 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Cover Letter</h4>
                                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                    {app.coverLetter}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Applied {format(new Date(app.createdAt), "MMM d, yyyy")}
                                                </span>
                                                {app.status !== 'PENDING' && (
                                                    <Badge variant={
                                                        app.status === 'ACCEPTED' ? 'default' : 'destructive'
                                                    } className="uppercase text-[10px] font-bold px-2 py-0">
                                                        {app.status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {/* AI Interview Questions Section */}
                                            <div className="mt-6 border-t border-border/50 pt-6">
                                                {!interviewQuestions[app.id] ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleGenerateQuestions(app.id, app.applicant)}
                                                        disabled={isGeneratingQuestions[app.id]}
                                                        className="text-xs font-bold text-primary hover:bg-primary/5 gap-2 rounded-xl h-9"
                                                    >
                                                        {isGeneratingQuestions[app.id] ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Wand2 className="h-3.5 w-3.5" />
                                                        )}
                                                        Generate Smart Interview Questions
                                                    </Button>
                                                ) : (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-4"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Sparkles className="h-3 w-3 text-primary" />
                                                            </div>
                                                            <h4 className="text-sm font-black text-foreground uppercase tracking-wider">AI Tailored Interview Guide</h4>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            {interviewQuestions[app.id].map((q, i) => (
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.1 }}
                                                                    key={i}
                                                                    className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm font-medium text-foreground/80 flex gap-4"
                                                                >
                                                                    <span className="text-primary font-black opacity-30">0{i + 1}</span>
                                                                    {q}
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row md:flex-col items-stretch justify-center gap-3 md:border-l md:border-border md:pl-8 md:w-56 mt-4 md:mt-0">
                                            <Button
                                                className="flex-1 md:w-full h-10 gap-2 shadow-sm hover:shadow-md transition-all font-semibold active:scale-[0.98]"
                                                onClick={() => handleStartChat(app.applicantId)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                Chat
                                            </Button>

                                            {app.status === 'PENDING' && (
                                                <>
                                                    <Button
                                                        className="flex-1 md:w-full h-10 gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all font-semibold"
                                                        onClick={() => handleAccept(app.id)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 md:w-full h-10 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all font-semibold"
                                                        onClick={() => handleReject(app.id)}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="flex-1 md:w-full h-10 gap-2 border-2 hover:bg-muted/50 transition-all font-semibold active:scale-[0.98]"
                                                onClick={() => router.push(`/profile/${app.applicantId}`)}
                                            >
                                                <User className="h-4 w-4" />
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
