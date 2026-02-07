"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User, Download, ExternalLink, Loader2, Star } from "lucide-react";
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
                            <div className="bg-card border border-border rounded-2xl p-12 text-center">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <User className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">No applications yet</h3>
                                <p className="text-muted-foreground mt-2">
                                    Wait for freelancers to discover your job posting.
                                </p>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={app.id}
                                    className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Applicant Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16 border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                                                        <AvatarImage src={app.applicant.avatar} />
                                                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                                            {app.applicant.firstName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className="text-xl font-bold tracking-tight">
                                                                {app.applicant.firstName} {app.applicant.lastName}
                                                            </h3>
                                                            {app.aiMatchScore && app.aiMatchScore > 80 && (
                                                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 px-2 py-0.5 whitespace-nowrap">
                                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                                    {app.aiMatchScore}% Match
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground text-sm line-clamp-1 max-w-sm">
                                                            {app.applicant.bio || "No bio provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block bg-muted/20 px-4 py-2 rounded-2xl border border-border/50">
                                                    <div className="font-bold text-xl text-primary">
                                                        ${app.proposedRate}/hr
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                                        Proposed Rate
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Proposed Rate for Mobile */}
                                            <div className="sm:hidden mb-4 flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                <span className="text-sm font-medium text-muted-foreground">Proposed Rate</span>
                                                <span className="text-lg font-bold text-primary">${app.proposedRate}/hr</span>
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
                                                className="flex-1 md:w-full h-11 gap-2 shadow-md hover:shadow-lg transition-all font-semibold active:scale-[0.98]"
                                                onClick={() => handleStartChat(app.applicantId)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                Chat
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 md:w-full h-11 gap-2 border-2 hover:bg-muted/50 transition-all font-semibold active:scale-[0.98]"
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
