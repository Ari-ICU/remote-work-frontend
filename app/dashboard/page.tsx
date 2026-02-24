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
import { useAuth } from "@/components/providers/auth-provider";
import { jobsService } from "@/lib/services/jobs";
import { applicationService } from "@/lib/services/application";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
    const { user, isLoading: authLoading, refresh } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (authLoading) return;

            console.log("Dashboard: Starting initialization...");
            setIsDataLoading(true);
            setError(null);

            try {
                let currentUser = user;

                if (!currentUser) {
                    const hasSession = typeof window !== 'undefined' &&
                        (localStorage.getItem('refreshToken') || document.cookie.includes('is_authenticated=true'));

                    if (!hasSession) {
                        console.log("Dashboard: No session found, redirecting to login");
                        if (isMounted) router.push("/login?redirect=/dashboard");
                        return;
                    }

                    console.log("Dashboard: No user in context but session exists, attempting refresh...");
                    try {
                        const res = await refresh();
                        currentUser = res.user;
                        console.log("Dashboard: Refresh successful, user restored");
                    } catch (e) {
                        console.log("Dashboard: Refresh failed, redirecting to login");
                        if (isMounted) router.push("/login?redirect=/dashboard");
                        return;
                    }
                }

                if (!isMounted) return;

                console.log("Dashboard: Fetching data from services...");
                // Fetch both - user might be both poster and applicant
                try {
                    const [myJobs, myApps, allJobs] = await Promise.all([
                        jobsService.getMyJobs()
                            .then(res => { console.log("Dashboard: My jobs loaded"); return res; })
                            .catch((err) => { console.error("Dashboard: Error fetching my jobs:", err); return []; }),
                        applicationService.getMyApplications()
                            .then(res => { console.log("Dashboard: My apps loaded"); return res; })
                            .catch((err) => { console.error("Dashboard: Error fetching my apps:", err); return []; }),
                        jobsService.getAll()
                            .then(res => { console.log("Dashboard: All jobs loaded"); return res; })
                            .catch((err) => { console.error("Dashboard: Error fetching all jobs:", err); return []; })
                    ]);

                    if (!isMounted) return;

                    console.log("Dashboard: Data fetch complete", {
                        jobsCount: myJobs?.length || 0,
                        appsCount: myApps?.length || 0
                    });

                    setJobs(myJobs || []);
                    setApplications(myApps || []);

                    // Simple recommendation logic for freelancers
                    if (currentUser && currentUser.role === 'FREELANCER' && currentUser.skills) {
                        const recommended = (allJobs || [])
                            .filter((j: any) => !(myApps || []).some((app: any) => app.jobId === j.id))
                            .map((j: any) => {
                                const matchingSkills = j.tags?.filter((t: string) =>
                                    currentUser.skills.some((s: string) => s.toLowerCase() === t.toLowerCase())
                                ) || [];
                                const totalRequired = j.tags?.length || 1;
                                // Calculate match percentage (Skills + category match)
                                let matchPercentage = Math.round((matchingSkills.length / totalRequired) * 100);
                                if (j.category.toLowerCase() === currentUser.headline?.toLowerCase()) matchPercentage += 10;
                                return { ...j, matchScore: Math.min(matchPercentage, 100) };
                            })
                            .filter((j: any) => j.matchScore > 20)
                            .sort((a: any, b: any) => b.matchScore - a.matchScore)
                            .slice(0, 3);
                        setRecommendations(recommended);
                    }
                } catch (dataError) {
                    console.error("Dashboard: Error fetching data", dataError);
                    // Don't fail the whole page if just one fetch fails
                }
            } catch (error) {
                console.error("Dashboard: Critical initialization error", error);
                if (isMounted) {
                    setError("Unable to connect to service. Please verify your connection.");
                    toast.error("Failed to load dashboard data.");
                }
            } finally {
                if (isMounted) {
                    setIsDataLoading(false);
                }
            }
        };

        if (!authLoading) {
            init();
        }

        return () => {
            isMounted = false;
        };
    }, [router, authLoading, user, refresh]);

    // Calculate profile completion percentage
    const profileCompletion = (() => {
        if (!user || user.role !== 'FREELANCER') return null;
        let score = 0;
        if (user.avatar) score += 10;
        if (user.bio && user.bio.length > 20) score += 20;
        if (user.headline) score += 10;
        if (user.skills && user.skills.length > 0) score += 20;
        if (user.hourlyRate) score += 10;
        if (user.location) score += 10;
        if (user.resumeUrl) score += 20;
        return score;
    })();

    const getCompletionColor = (score: number) => {
        if (score < 40) return "bg-rose-500";
        if (score < 80) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const safeDate = (dateString: string | Date) => {
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return "N/A";
            return format(d, 'MMM d, yyyy');
        } catch (e) {
            return "N/A";
        }
    };

    if (authLoading || isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Synchronizing your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 text-center">
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Initialization Failed</h2>
                    <p className="text-muted-foreground max-w-md">{error}</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
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

                    {user.role === "FREELANCER" && profileCompletion !== null && profileCompletion < 100 && (
                        <Card className="border-primary/20 bg-primary/[0.02] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <TrendingUp className="h-32 w-32 text-primary" />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative h-20 w-20 flex-shrink-0">
                                        <svg className="h-20 w-20 -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="36"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-muted"
                                            />
                                            <motion.circle
                                                initial={{ strokeDashoffset: 226 }}
                                                animate={{ strokeDashoffset: 226 - (226 * (profileCompletion || 0)) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="40"
                                                cy="40"
                                                r="36"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray="226"
                                                strokeLinecap="round"
                                                className="text-primary"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                                            {profileCompletion}%
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                                            Complete your profile to stand out
                                            <Sparkles className="h-5 w-5 text-amber-500" />
                                        </h3>
                                        <p className="text-muted-foreground text-sm max-w-xl">
                                            Profiles with 100% completion get up to <span className="text-foreground font-bold italic">3x more invitations</span> from top employers. Add your portfolio and skills today!
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                                            {!user.skills?.length && <Badge variant="outline" className="bg-background">Missing Skills</Badge>}
                                            {!user.resumeUrl && <Badge variant="outline" className="bg-background">Missing Resume</Badge>}
                                            {(profileCompletion || 0) >= 80 && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Almost there!</Badge>}
                                        </div>
                                    </div>
                                    <Link href="/profile">
                                        <Button className="rounded-xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                            Update Profile
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                                                                        onClick={() => {
                                                                                            toast("Close this job?", {
                                                                                                description: "New applicants will be blocked. You can re-open it later.",
                                                                                                action: {
                                                                                                    label: "Close Job",
                                                                                                    onClick: async () => {
                                                                                                        toast.promise(jobsService.update(job.id, { status: 'CANCELLED' }), {
                                                                                                            loading: 'Closing job...',
                                                                                                            success: () => {
                                                                                                                // Trigger a local refresh
                                                                                                                jobsService.getMyJobs().then(setJobs);
                                                                                                                return 'Job closed successfully.';
                                                                                                            },
                                                                                                            error: 'Failed to close job.'
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                            });
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
                                                                                                toast.promise(jobsService.update(job.id, { status: 'OPEN' }), {
                                                                                                    loading: 'Re-opening job...',
                                                                                                    success: () => {
                                                                                                        jobsService.getMyJobs().then(setJobs);
                                                                                                        return 'Job re-opened!';
                                                                                                    },
                                                                                                    error: 'Failed to re-open job.'
                                                                                                });
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
                                                className="bg-card border border-border/50 hover:border-primary/30 rounded-2xl p-6 shadow-sm transition-all group overflow-hidden relative"
                                            >
                                                {/* Background Accent */}
                                                <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                                                <div className="flex items-start justify-between mb-4 relative z-10">
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className="w-fit text-[9px] font-black underline decoration-primary/50 underline-offset-2 uppercase tracking-widest bg-primary/5 text-primary border-transparent p-0">
                                                            {job.category}
                                                        </Badge>
                                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-1.5 shadow-sm">
                                                            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                                                            <span className="text-[10px] font-black text-primary">{job.matchScore}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                                                    {job.tags?.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 bg-muted/40 font-medium border-none lowercase">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-border/40 relative z-10">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Estimated</span>
                                                        <span className="text-sm font-black text-emerald-500 flex items-center gap-0.5">
                                                            <DollarSign className="h-4 w-4" />
                                                            {job.budget}
                                                        </span>
                                                    </div>
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <Button size="sm" className="rounded-xl h-8 px-4 text-[11px] font-bold shadow-md shadow-primary/10 group-hover:shadow-primary/30 transition-all">
                                                            Details <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    }
                </div >
            </main >
        </div >
    );
}
