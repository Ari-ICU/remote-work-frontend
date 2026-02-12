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
    Loader2,
    MoreHorizontal,
    Bookmark,
    ChevronRight,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { authService } from "@/lib/services/auth";
import { jobsService } from "@/lib/services/jobs";
import { applicationService } from "@/lib/services/application";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
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
                const [myJobs, myApps, allJobs] = await Promise.all([
                    jobsService.getMyJobs().catch(() => []),
                    applicationService.getMyApplications().catch(() => []),
                    jobsService.getAll().catch(() => [])
                ]);
                setJobs(myJobs || []);
                setApplications(myApps || []);

                // Simple recommendation logic for freelancers
                if (currentUser.role === 'FREELANCER' && currentUser.skills) {
                    const recommended = allJobs
                        .filter((j: any) => !myApps.some((app: any) => app.jobId === j.id))
                        .map((j: any) => {
                            const score = j.tags?.filter((t: string) =>
                                currentUser.skills.some((s: string) => s.toLowerCase() === t.toLowerCase())
                            ).length || 0;
                            return { ...j, matchScore: score };
                        })
                        .filter((j: any) => j.matchScore > 0)
                        .sort((a: any, b: any) => b.matchScore - a.matchScore)
                        .slice(0, 3);
                    setRecommendations(recommended);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [router]);

    const safeDate = (dateString: string | Date) => {
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return "N/A";
            return format(d, 'MMM d, yyyy');
        } catch (e) {
            return "N/A";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome back, {user?.firstName || 'User'}.
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
                                            {jobs.filter(j => j?.status === 'OPEN').length}
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
                                            {jobs.reduce((acc, job) => acc + (job?._count?.applications || 0), 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                                <Tabs defaultValue="all" className="w-full">
                                    <div className="p-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                            Your Job Postings
                                        </h2>
                                        <TabsList className="bg-background border border-border">
                                            <TabsTrigger value="all">All</TabsTrigger>
                                            <TabsTrigger value="open">Open</TabsTrigger>
                                            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {[
                                        { id: "all", filter: () => true },
                                        { id: "open", filter: (j: any) => j.status === 'OPEN' },
                                        { id: "in_progress", filter: (j: any) => j.status === 'COMPLETED' || j.hiredFreelancerId },
                                        { id: "cancelled", filter: (j: any) => j.status === 'CANCELLED' }
                                    ].map((tab) => (
                                        <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                            <div className="divide-y divide-border/50">
                                                {jobs.filter(tab.filter).length === 0 ? (
                                                    <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground gap-4">
                                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                            <Briefcase className="h-6 w-6 text-muted-foreground/50" />
                                                        </div>
                                                        <p>No {tab.id === 'all' ? '' : tab.id.replace('_', ' ')} jobs found.</p>
                                                        {tab.id === 'open' && (
                                                            <Link href="/post-job">
                                                                <Button variant="outline" className="mt-2">Post a new job</Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                ) : (
                                                    jobs.filter(tab.filter).map((job) => (
                                                        <div key={job.id} className="p-6 transition-colors hover:bg-muted/30 group">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                                {/* Job Info */}
                                                                <div className="space-y-3 flex-1">
                                                                    <div className="flex items-start justify-between md:justify-start gap-4">
                                                                        <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                                                                            {job.title}
                                                                        </Link>
                                                                        <Badge variant={
                                                                            job.status === 'OPEN' ? 'default' :
                                                                                (job.status === 'COMPLETED' || job.hiredFreelancerId) ? 'secondary' :
                                                                                    'destructive'
                                                                        } className={cn(
                                                                            "shrink-0 capitalize",
                                                                            (job.status === 'COMPLETED' || job.hiredFreelancerId) && "bg-blue-500 hover:bg-blue-600 border-none text-white"
                                                                        )}>
                                                                            {job.status === 'COMPLETED' || job.hiredFreelancerId ? 'In Progress' : job.status.toLowerCase().replace('_', ' ')}
                                                                        </Badge>
                                                                    </div>

                                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Clock className="h-4 w-4" />
                                                                            Posted {safeDate(job.createdAt)}
                                                                        </span>
                                                                        <span className="flex items-center gap-1.5">
                                                                            <DollarSign className="h-4 w-4" />
                                                                            {job.budgetType}
                                                                        </span>
                                                                        {job.hiredFreelancerId && (
                                                                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                                                                <CheckCircle2 className="h-4 w-4" />
                                                                                Hired
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Stats & Actions */}
                                                                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-border/50">
                                                                    <div className="text-right px-4 border-r border-border/50 pr-6 mr-2 hidden md:block">
                                                                        <span className="text-2xl font-bold text-foreground leading-none block">
                                                                            {job._count?.applications || 0}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                                                                            Applicants
                                                                        </span>
                                                                    </div>

                                                                    {/* Mobile Stats */}
                                                                    <div className="flex items-center gap-2 md:hidden">
                                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="font-medium text-foreground">
                                                                            {job._count?.applications || 0} Applicants
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <Link href={`/dashboard/job/${job.id}/applications`}>
                                                                            <Button variant="outline" size="sm" className="gap-2 h-9">
                                                                                <Users className="h-4 w-4" />
                                                                                <span className="hidden sm:inline">View Applicants</span>
                                                                                <span className="sm:hidden">Applicants</span>
                                                                            </Button>
                                                                        </Link>

                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                    <span className="sr-only">Open menu</span>
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-48">
                                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                <Link href={`/jobs/${job.id}`} className="w-full">
                                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                                        View Public Page
                                                                                    </DropdownMenuItem>
                                                                                </Link>
                                                                                <DropdownMenuSeparator />
                                                                                {job.status === 'OPEN' ? (
                                                                                    <DropdownMenuItem
                                                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                                        onClick={async () => {
                                                                                            if (confirm('Are you sure you want to CLOSE this job? New applicants will be blocked.')) {
                                                                                                await jobsService.update(job.id, { status: 'CANCELLED' });
                                                                                                window.location.reload();
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                                        Close Job
                                                                                    </DropdownMenuItem>
                                                                                ) : (
                                                                                    job.status === 'CANCELLED' && (
                                                                                        <DropdownMenuItem
                                                                                            className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 cursor-pointer"
                                                                                            onClick={async () => {
                                                                                                await jobsService.update(job.id, { status: 'OPEN' });
                                                                                                window.location.reload();
                                                                                            }}
                                                                                        >
                                                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                                            Re-open Job
                                                                                        </DropdownMenuItem>
                                                                                    )
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
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
                                <Link href="/jobs/saved" className="block group">
                                    <Card className="h-full group-hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                                            <Bookmark className="h-4 w-4 text-primary" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-bold">Wishlist</div>
                                                <div className="text-xs text-primary font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    View All <ChevronRight className="h-3 w-3" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
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
                                                    <h3 className="font-semibold text-lg">{app.job?.title || 'Unknown Job'}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{app.job?.companyName || app.job?.posterRef?.firstName || 'Unknown Company'}</span>
                                                        <span>•</span>
                                                        <span>Applied {safeDate(app.createdAt)}</span>
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
                                                    <Link href={`/messages?userId=${app.job?.poster?.id}`}>
                                                        {/* This link assumes messaging the employer is allowed */}
                                                        {/* Ideally we check if a conversation exists or if it's allowed */}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recommendations Section */}
                            {recommendations.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            Smart Recommended Matches
                                        </h2>
                                        <Link href="/jobs" className="text-xs font-bold text-primary hover:underline">
                                            View Explorer
                                        </Link>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {recommendations.map((job) => (
                                            <motion.div
                                                key={job.id}
                                                whileHover={{ y: -5 }}
                                                className="bg-card border border-border/50 hover:border-primary/30 rounded-2xl p-6 shadow-sm transition-all group"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                                                        {job.category}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                                                        <TrendingUp className="h-3 w-3" />
                                                        High Match
                                                    </div>
                                                </div>
                                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                                                <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    {job.company}
                                                </p>
                                                <Link href={`/jobs/${job.id}`}>
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                                                        Check It Out
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
