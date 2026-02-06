"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Briefcase,
    FileText,
    Users,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle,
    Eye,
    Plus,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { authService } from "@/lib/services/auth";
import { jobsService } from "@/lib/services/jobs";
import { applicationService } from "@/lib/services/application";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                router.push("/login?redirect=/dashboard");
                return;
            }
            setUser(currentUser);

            try {
                // Fetch both - user might be both poster and applicant
                const [myJobs, myApps] = await Promise.all([
                    jobsService.getMyJobs().catch(() => []),
                    applicationService.getMyApplications().catch(() => [])
                ]);
                setJobs(myJobs);
                setApplications(myApps);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome back, {user.firstName}.
                            </p>
                        </div>
                        {user.role === "EMPLOYER" && (
                            <Link href="/post-job">
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" /> Post New Job
                                </Button>
                            </Link>
                        )}
                    </div>

                    {user.role === "EMPLOYER" ? (
                        /* EMPLOYER VIEW */
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{jobs.length}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {jobs.filter(j => j.status === 'OPEN').length}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {jobs.reduce((acc, job) => acc + (job._count?.applications || 0), 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-lg font-semibold">Your Job Postings</h2>
                                </div>
                                <div className="divide-y divide-border">
                                    {jobs.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            You haven't posted any jobs yet.
                                        </div>
                                    ) : (
                                        jobs.map((job) => (
                                            <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:underline hover:text-primary">
                                                            {job.title}
                                                        </Link>
                                                        <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'}>
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" /> Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4" /> {job.budgetType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm text-right mr-4">
                                                        <span className="font-bold text-foreground block">
                                                            {job._count?.applications || 0}
                                                        </span>
                                                        <span className="text-muted-foreground">Applicants</span>
                                                    </div>
                                                    <Link href={`/dashboard/job/${job.id}/applications`}>
                                                        <Button variant="outline" className="gap-2">
                                                            <Users className="h-4 w-4" />
                                                            View Applicants
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* FREELANCER VIEW */
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{applications.length}</div>
                                    </CardContent>
                                </Card>
                                {/* Add more freelancer stats here if needed */}
                            </div>

                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-lg font-semibold">Application History</h2>
                                </div>
                                <div className="divide-y divide-border">
                                    {applications.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            You haven't applied to any jobs yet.
                                        </div>
                                    ) : (
                                        applications.map((app) => (
                                            <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg">{app.job.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{app.job.companyName || `${app.job.poster?.firstName} ${app.job.poster?.lastName}`}</span>
                                                        <span>•</span>
                                                        <span>Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={
                                                        app.status === 'ACCEPTED' ? 'bg-green-500' :
                                                            app.status === 'REJECTED' ? 'bg-red-500' :
                                                                'bg-blue-500'
                                                    }>
                                                        {app.status}
                                                    </Badge>
                                                    <Link href={`/messages?userId=${app.job.poster?.id}`}>
                                                        {/* This link assumes messaging the employer is allowed */}
                                                        {/* Ideally we check if a conversation exists or if it's allowed */}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
