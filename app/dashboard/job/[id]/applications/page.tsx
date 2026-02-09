"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User, Download, ExternalLink, Loader2, Star, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { applicationService } from "@/lib/services/application";
import { jobsService } from "@/lib/services/jobs";
import { format } from "date-fns";

export default function JobApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!params.id) return;
            try {
                // Fetch job details first to ensure it matches
                // Note: Frontend jobsService.getById returns mapped object, might need raw for some items,
                // but checking title is enough for context.
                const jobData = await jobsService.getById(params.id as string);
                setJob(jobData);

                const appsData = await applicationService.getForJob(params.id as string);
                setApplications(appsData);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
                // Redirect if access denied or not found
                // router.push("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [params.id]);

    const handleStartChat = (applicantId: string) => {
        // Navigate to messages with pre-selected use logic
        // We'll need to implement the "auto-select" in /messages based on URL param
        router.push(`/messages?userId=${applicantId}`);
    };

    const handleAccept = async (appId: string) => {
        if (!confirm('Are you sure you want to ACCEPT this application? This will hire the freelancer and close the job to other applicants.')) return;
        try {
            await applicationService.accept(appId);
            window.location.reload();
        } catch (error) {
            console.error("Failed to accept application:", error);
            alert('Failed to accept application. Please try again.');
        }
    };

    const handleReject = async (appId: string) => {
        if (!confirm('Are you sure you want to REJECT this application?')) return;
        try {
            await applicationService.reject(appId);
            window.location.reload();
        } catch (error) {
            console.error("Failed to reject application:", error);
            alert('Failed to reject application. Please try again.');
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
                                                            {app.aiMatchScore && app.aiMatchScore > 80 && (
                                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 px-2 py-0.5">
                                                                    <Star className="w-3 h-3 fill-emerald-700" />
                                                                    {app.aiMatchScore}% Match
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
                                                    <Loader2 className="h-3 w-3 animate-none" /> {/* Placeholder for calendar icon if needed */}
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
            </main >
        </div >
    );
}
