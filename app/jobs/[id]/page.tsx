"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Building2,
    MapPin,
    DollarSign,
    Clock,
    Calendar,
    Briefcase,
    Globe,
    ShieldCheck,
    Share2,
    Bookmark,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Check,
    XCircle,
    Info,
    ArrowRight,
    Search,
    Star,
    ExternalLink,
    Mail,
    Copy,
    Eye,
    Sparkles,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types/job";
import { jobsService } from "@/lib/services/jobs";
import { wishlistService } from "@/lib/services/wishlist";
import { fadeIn, scaleUp, staggerContainer } from "@/lib/animations";
import { slugify, cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Sub-components ---

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="inline-flex items-center gap-3 mb-8 bg-primary/5 text-primary px-5 py-2.5 rounded-2xl border border-primary/10 select-none">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest">{title}</h2>
    </div>
);

const JobSkeleton = () => (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-6 w-48 rounded-lg hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
                <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
            </div>
            <div className="lg:col-span-4 space-y-6">
                <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
                <Skeleton className="h-[350px] w-full rounded-[2.5rem]" />
            </div>
        </div>
    </div>
);

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        setUser(currentUser);
    }, []);

    const matchingSkills = user && job?.tags ? job.tags.filter((tag: string) =>
        user.skills?.some((s: string) => s.toLowerCase() === tag.toLowerCase())
    ) : [];

    const missingSkills = user && job?.tags ? job.tags.filter((tag: string) =>
        !user.skills?.some((s: string) => s.toLowerCase() === tag.toLowerCase())
    ) : [];

    const matchPercentage = job?.tags && job.tags.length > 0
        ? Math.round((matchingSkills.length / job.tags.length) * 100)
        : 0;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchJob = async () => {
            if (params.id) {
                try {
                    setIsLoading(true);
                    const foundJob = await jobsService.getById(params.id as string);
                    setJob(foundJob);

                    // Fetch similar jobs
                    const allJobs = await jobsService.getAll();
                    const filtered = allJobs
                        .filter((j: Job) =>
                            j.id.toString() !== params.id &&
                            (j.category === foundJob.category || j.tags.some((t: string) => foundJob.tags.includes(t)))
                        )
                        .slice(0, 3);
                    setSimilarJobs(filtered);

                    // Check if job is saved
                    setIsSaved(wishlistService.isJobSaved(params.id as string));

                    setError(null);
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

    const handleApply = () => {
        if (job) {
            router.push(`/apply/${job.id}/${slugify(job.title)}`);
        }
    };

    const handleToggleSave = () => {
        if (!job) return;
        const newState = wishlistService.toggleJob(job.id.toString());
        setIsSaved(newState);
        if (newState) {
            toast.success("Saved to your wishlist!", {
                description: "You can access your saved jobs anytime.",
                action: {
                    label: "View Wishlist",
                    onClick: () => router.push("/jobs/saved"),
                },
            });
        } else {
            toast.info("Removed from wishlist");
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!", {
                icon: <Copy className="h-4 w-4" />,
            });
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 pt-24 pb-24">
                    <JobSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center pt-24 gap-6 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-24 w-24 rounded-[2rem] bg-destructive/5 flex items-center justify-center border border-destructive/10"
                    >
                        <Search className="h-10 w-10 text-destructive/50" />
                    </motion.div>
                    <div className="text-center space-y-2 max-w-sm">
                        <h1 className="text-3xl font-bold tracking-tight">{error || "Job not found"}</h1>
                        <p className="text-muted-foreground">This opportunity may have been filled or the link has expired.</p>
                    </div>
                    <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 h-12">
                        <Link href="/jobs" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Return to Explore
                        </Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
            <Header />

            {/* Floating Mobile Action Bar */}
            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[calc(100%-2rem)] max-w-md"
                    >
                        <div className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl p-4 shadow-2xl shadow-black/20 flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black truncate leading-tight">{job.title}</p>
                                <p className="text-xs text-primary font-bold flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {job.salary}
                                </p>
                            </div>
                            <Button size="sm" onClick={handleApply} className="rounded-xl px-6 h-11 font-black shadow-lg shadow-primary/25 text-xs uppercase tracking-wider">
                                Apply
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 pt-24 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Status Banner */}
                    {job.status !== 'OPEN' && (
                        <div className="mb-8 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3 text-destructive">
                            <Info className="h-5 w-5" />
                            <p className="font-bold">
                                This job is currently {job.status?.toLowerCase().replace('_', ' ')}. Applications are no longer being accepted.
                            </p>
                        </div>
                    )}
                    {/* Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <motion.button
                            onClick={() => router.back()}
                            whileHover={{ x: -4 }}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2 px-1"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to results
                        </motion.button>

                        <nav className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <Link href="/jobs" className="hover:text-primary transition-colors">Explorer</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-primary truncate max-w-[200px]">{job.title}</span>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Content (L: 8/12) */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Premium Header Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm relative group"
                            >
                                {/* Decorative Gradient Blobs */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-bl-full -mr-24 -mt-24 blur-3xl group-hover:opacity-100 opacity-60 transition-opacity duration-700 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-tr-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

                                <div className="p-8 md:p-12 relative">
                                    <div className="flex flex-wrap items-center gap-3 mb-10">
                                        <Badge variant="outline" className="px-4 py-2 rounded-full border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5">
                                            {job.category}
                                        </Badge>
                                        <Badge variant="outline" className="px-4 py-2 rounded-full border-border text-muted-foreground font-black text-[10px] uppercase tracking-widest bg-muted/20">
                                            {job.type}
                                        </Badge>
                                        {job.featured && (
                                            <Badge className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 border-amber-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20">
                                                <Star className="h-3 w-3 mr-1.5 fill-current" />
                                                Priority
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-10 leading-[1.05]">
                                        {job.title}
                                    </h1>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 pb-10 border-b border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary shrink-0">
                                                <Building2 className="h-7 w-7" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Company</p>
                                                <p className="font-black text-foreground text-lg truncate">{job.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary shrink-0">
                                                <MapPin className="h-7 w-7" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Location</p>
                                                <p className="font-black text-foreground text-lg truncate">{job.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary shrink-0">
                                                <DollarSign className="h-7 w-7" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                                                    {job.budgetType === 'HOURLY' ? 'Hourly Rate' : 'Fixed Budget'}
                                                </p>
                                                <p className="font-black text-foreground text-lg truncate">{job.salary}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold bg-muted/40 px-5 py-2.5 rounded-full border border-border/50">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            Posted {job.posted}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={job.status !== 'OPEN'}
                                                className={cn(
                                                    "h-14 w-14 rounded-2xl transition-all duration-300",
                                                    isSaved ? "bg-primary border-primary text-white shadow-xl shadow-primary/25 scale-105" : "hover:bg-primary/5 hover:border-primary/50",
                                                    job.status !== 'OPEN' && "opacity-50 cursor-not-allowed"
                                                )}
                                                onClick={handleToggleSave}
                                            >
                                                <Bookmark className={cn("h-6 w-6", isSaved && "fill-current")} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-14 w-14 rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all active:scale-95"
                                                onClick={handleShare}
                                            >
                                                <Share2 className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Detailed Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
                            >
                                <div className="space-y-16">
                                    {/* Description Section */}
                                    <section>
                                        <SectionHeader icon={Info} title="Project Overview" />
                                        <div className="text-muted-foreground leading-relaxed text-xl prose dark:prose-invert max-w-none">
                                            <div className="relative">
                                                <span className="absolute -left-4 top-0 h-full w-1 bg-primary/20 rounded-full" />
                                                <p className="pl-6 font-medium">
                                                    {job.description || "Detailed information for this position is currently being updated. Please check back shortly for more specifics about the role and project scope."}
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Responsibilities */}
                                    {job.responsibilities && job.responsibilities.length > 0 && (
                                        <section>
                                            <SectionHeader icon={Briefcase} title="Core Responsibilities" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {job.responsibilities.map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        viewport={{ once: true }}
                                                        whileHover={{ y: -3, backgroundColor: 'var(--muted)' }}
                                                        className="flex gap-4 p-6 rounded-[2rem] bg-muted/30 border border-border/50 hover:bg-muted/40 transition-all group"
                                                    >
                                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-bold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{item}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Requirements */}
                                    {job.requirements && job.requirements.length > 0 && (
                                        <section>
                                            <SectionHeader icon={ShieldCheck} title="Ideal Candidate" />
                                            <div className="space-y-4">
                                                {job.requirements.map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        viewport={{ once: true }}
                                                        className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group relative overflow-hidden"
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                                                        <div className="h-2.5 w-2.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all shadow-sm shadow-primary/20" />
                                                        <span className="font-black text-foreground/80 group-hover:text-foreground text-base tracking-tight">{item}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Skills Tags */}
                                    <div className="pt-12 border-t border-border/50">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">Ecosystem & Expertise</p>
                                        <div className="flex flex-wrap gap-3">
                                            {job.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all cursor-default rounded-xl py-2.5 px-6 font-black text-xs border border-border/50 hover:border-primary/30 uppercase tracking-widest shadow-sm"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        {/* AI Skill Gap Analysis */}
                                        {user && job.tags.length > 0 && (
                                            <div className="pt-12 border-t border-border/50">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">AI Performance Index</p>
                                                        <h3 className="text-2xl font-black text-foreground">Skill Synthesis</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-black text-primary">{matchPercentage}%</div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Profile Match</p>
                                                    </div>
                                                </div>

                                                <div className="grid gap-8 md:grid-cols-2">
                                                    <div className="space-y-4">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            Strengths ({matchingSkills.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {matchingSkills.map((skill: string) => (
                                                                <div key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                                    {skill}
                                                                </div>
                                                            ))}
                                                            {matchingSkills.length === 0 && (
                                                                <p className="text-xs text-muted-foreground italic">Add skills to your profile to see highlights.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Sparkles className="h-3 w-3 text-amber-500" />
                                                            Growth Areas ({missingSkills.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {missingSkills.map((skill: string) => (
                                                                <div key={skill} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                                    {skill}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Visual Progress Bar */}
                                                <div className="mt-8 h-2 w-full bg-muted/30 rounded-full overflow-hidden border border-border/50 p-0.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${matchPercentage}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                                    />
                                                </div>

                                                <p className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-primary leading-relaxed flex gap-3">
                                                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <span>
                                                        {matchPercentage >= 80
                                                            ? "Your profile is an exceptional match for this role! We highly recommend applying immediately."
                                                            : matchPercentage >= 50
                                                                ? "You have a solid foundation. Highlighting your experience in the 'Growth Areas' during the interview could bridge the gap."
                                                                : "This role requires several new skills. Consider taking a certification or building a project in these areas to improve your eligibility."}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar (R: 4/12) */}
                        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                            {/* Action Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-primary rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(59,130,246,0.3)] relative overflow-hidden group"
                            >
                                {/* Background Decorative element */}
                                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors" />
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors" />

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Apply Today</h3>
                                    <p className="text-white/80 font-bold mb-10 leading-relaxed text-lg">
                                        Ready to contribute to <span className="text-white underline decoration-white/30">{job.company}'s</span> next success story?
                                    </p>

                                    <div className="space-y-5">
                                        <Button
                                            size="lg"
                                            className="w-full h-16 bg-white text-primary hover:bg-white/95 font-black text-xl rounded-2xl shadow-xl transition-all active:scale-[0.98] group/btn"
                                            onClick={handleApply}
                                        >
                                            Apply Now
                                            <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover/btn:translate-x-1.5" />
                                        </Button>

                                        <div className="flex items-center justify-center gap-6 pt-4">
                                            <div className="text-center">
                                                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1.5">Avg Response</p>
                                                <p className="text-xs text-white font-black tracking-wide">48 Hours</p>
                                            </div>
                                            <div className="w-px h-10 bg-white/20" />
                                            <div className="text-center">
                                                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1.5">Social Proof</p>
                                                <div className="flex items-center gap-1.5 justify-center">
                                                    <Eye className="h-3.5 w-3.5 text-white" />
                                                    <p className="text-xs text-white font-black tracking-wide">12 others looking</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Company Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm group hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="h-16 w-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                        <Building2 className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl leading-tight group-hover:text-primary transition-colors duration-300">{job.company}</h4>
                                        <div className="flex items-center gap-1.5 text-primary mt-1">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center justify-between py-4 border-b border-border/10 group/item">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest group-hover/item:text-primary/60 transition-colors">Industry</span>
                                        <span className="text-xs font-black tracking-tight">{job.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-border/10 group/item">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest group-hover/item:text-primary/60 transition-colors">Environment</span>
                                        <span className="text-xs font-black tracking-tight">{job.remote ? "Remote First" : "Hybrid/Office"}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 group/item">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest group-hover/item:text-primary/60 transition-colors">Recruitment</span>
                                        <span className="text-xs font-black flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            Active Now
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {(() => {
                                        const hasWebsite = !!job.companyWebsite;
                                        const websiteUrl = hasWebsite
                                            ? (job.companyWebsite!.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`)
                                            : undefined;

                                        return (
                                            <Button
                                                asChild={hasWebsite}
                                                disabled={!hasWebsite}
                                                variant="outline"
                                                className="rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-2 border-dashed hover:border-solid transition-all group/link cursor-pointer"
                                            >
                                                {hasWebsite ? (
                                                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full h-full">
                                                        Site
                                                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                                    </a>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1.5 w-full h-full opacity-50">
                                                        Site
                                                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })()}

                                    {(() => {
                                        const hasPoster = !!job.posterId;

                                        return (
                                            <Button
                                                asChild={hasPoster}
                                                disabled={!hasPoster}
                                                variant="outline"
                                                className="rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-2 border-dashed hover:border-solid transition-all cursor-pointer"
                                            >
                                                {hasPoster ? (
                                                    <Link href={`/messages?userId=${job.posterId}`} className="flex items-center justify-center gap-1.5 w-full h-full">
                                                        Talk
                                                        <Mail className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                                                    </Link>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1.5 w-full h-full opacity-50">
                                                        Talk
                                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })()}
                                </div>
                            </motion.div>

                            {/* Tip Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-10 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                <div className="h-12 w-12 rounded-2xl bg-foreground text-background flex items-center justify-center mb-8 shadow-sm">
                                    <Info className="h-6 w-6" />
                                </div>
                                <h4 className="font-black text-lg mb-3 tracking-tight">Pro Submission Tip</h4>
                                <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                                    Highlight your experience with <span className="text-foreground">{job.tags[0] || "core technologies"}</span>. Companies in the <span className="text-foreground">{job.category}</span> sector prioritize candidates with specific project results over generic skills.
                                </p>
                            </motion.div>
                        </aside>
                    </div>

                    {/* Similar Positions Section */}
                    {similarJobs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-32 pt-20 border-t border-border/50"
                        >
                            <div className="flex items-end justify-between mb-12">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Curated Selections</p>
                                    <h2 className="text-4xl font-black tracking-tight">Similar <span className="text-primary italic">Positions</span></h2>
                                </div>
                                <Link href="/jobs">
                                    <Button variant="ghost" className="font-bold gap-2 group">
                                        View All
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {similarJobs.map((similarJob, index) => (
                                    <motion.div
                                        key={similarJob.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card border border-border/50 rounded-[2rem] p-8 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                <Building2 className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{similarJob.title}</h4>
                                                <p className="text-xs text-muted-foreground font-medium">{similarJob.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                                {similarJob.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-3.5 w-3.5 text-primary" />
                                                {similarJob.salary}
                                            </div>
                                        </div>
                                        <Link href={`/jobs/${similarJob.id}`}>
                                            <Button className="w-full rounded-xl font-bold gap-2">
                                                View Details
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
