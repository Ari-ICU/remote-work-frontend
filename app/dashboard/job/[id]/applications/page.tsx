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
                                                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                                                        <AvatarImage src={app.applicant.avatar} />
                                                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                                            {app.applicant.firstName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                                            {app.applicant.firstName} {app.applicant.lastName}
                                                            {app.aiMatchScore && app.aiMatchScore > 80 && (
                                                                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                                    {app.aiMatchScore}% Match
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm line-clamp-1">
                                                            {app.applicant.bio || "No bio provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <div className="font-bold text-lg text-primary">
                                                        ${app.proposedRate}/hr
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Proposed Rate
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-muted/30 rounded-xl p-4 mb-4">
                                                <h4 className="text-sm font-semibold mb-2 text-foreground/80">Cover Letter</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all">
                                                    {app.coverLetter}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                                                {app.status !== 'PENDING' && (
                                                    <Badge variant={
                                                        app.status === 'ACCEPTED' ? 'default' : 'destructive'
                                                    } className="uppercase text-[10px]">
                                                        {app.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col items-center justify-center gap-3 md:border-l md:border-border md:pl-6 md:w-48">
                                            <Button
                                                className="w-full gap-2 shadow-sm"
                                                onClick={() => handleStartChat(app.applicantId)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                Chat
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2"
                                                onClick={() => router.push(`/profile/${app.applicantId}`)}
                                            >
                                                <User className="h-4 w-4" />
                                                View Profile
                                            </Button>
                                            {/* <div className="flex gap-2 w-full mt-2">
                                                <Button variant="ghost" size="icon" className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50" title="Shortlist">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" title="Reject">
                                                    <XCircle className="h-5 w-5" />
                                                </Button>
                                            </div> */}
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
