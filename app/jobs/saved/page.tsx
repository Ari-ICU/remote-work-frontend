"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Calendar,
    ChevronRight,
    Search,
    Bookmark,
    Trash2,
    ArrowLeft,
    Clock,
    Building2,
    Star,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types/job";
import { jobsService } from "@/lib/services/jobs";
import { wishlistService } from "@/lib/services/wishlist";
import { cn, slugify } from "@/lib/utils";
import { toast } from "sonner";

export default function SavedJobsPage() {
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [recommendations, setRecommendations] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setIsLoading(true);
                const savedIds = wishlistService.getSavedJobIds();

                if (savedIds.length === 0) {
                    setSavedJobs([]);
                    return;
                }

                // Deduplicate IDs (extra safety)
                const uniqueIds = Array.from(new Set(savedIds));

                // Fetch all saved jobs (in a real app, there might be a batch endpoint)
                const jobPromises = uniqueIds.map(id => jobsService.getById(id).catch(() => null));
                const projects = await Promise.all(jobPromises);

                // Filter out null values and ensure jobs have required fields
                const validJobs = projects.filter((job): job is Job =>
                    job !== null &&
                    job.id != null &&
                    job.title != null &&
                    job.category != null &&
                    job.status === 'OPEN'
                );

                // Deduplicate by job ID
                const uniqueJobs = validJobs.filter((job, index, self) =>
                    index === self.findIndex(j => j.id === job.id)
                );

                // Clean up localStorage - remove IDs that failed to load
                const validIds = uniqueJobs.map(j => j.id.toString());
                const invalidIds = uniqueIds.filter(id => !validIds.includes(id));
                if (invalidIds.length > 0) {
                    console.log(`Removing ${invalidIds.length} invalid job IDs from wishlist`);
                    // Remove invalid IDs using the wishlist service
                    invalidIds.forEach(id => wishlistService.removeJob(id));
                    toast.info(`${invalidIds.length} job(s) were removed because they are no longer available.`);
                }

                setSavedJobs(uniqueJobs);
            } catch (err) {
                console.error("Failed to fetch saved jobs:", err);
                toast.error("Failed to load your wishlist");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (savedJobs.length > 0) {
                try {
                    const allJobs = await jobsService.getAll();
                    const savedIds = savedJobs.map(j => j?.id?.toString()).filter(Boolean);
                    const reco = allJobs.filter((j: Job) =>
                        j?.id && !savedIds.includes(j.id.toString()) &&
                        savedJobs.some(sj => sj?.category === j?.category)
                    ).slice(0, 3);
                    setRecommendations(reco);
                } catch (err) {
                    console.error("Failed to fetch recommendations", err);
                }
            }
        };
        fetchRecommendations();
    }, [savedJobs]);

    const removeJob = (id: string) => {
        wishlistService.removeJob(id);
        setSavedJobs(prev => prev.filter(job => job?.id?.toString() !== id));
        toast.info("Removed from wishlist");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Header />

            <main className="flex-1 pt-24 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]"
                            >
                                <Bookmark className="h-3 w-3" />
                                My Collection
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none"
                            >
                                Saved <span className="text-primary">Jobs</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-muted-foreground text-lg max-w-xl font-medium"
                            >
                                Keep track of the opportunities that catch your eye. Review and apply when you're ready.
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button asChild variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-2 border-dashed">
                                <Link href="/jobs">
                                    <Search className="mr-2 h-4 w-4" />
                                    Explore More
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-72 w-full rounded-[2.5rem]" />
                            ))}
                        </div>
                    ) : savedJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border/50 rounded-[3rem] p-20 text-center space-y-8 shadow-sm"
                        >
                            <div className="mx-auto h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center border border-primary/10">
                                <Bookmark className="h-10 w-10 text-primary/40" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tight">Your wishlist is empty</h2>
                                <p className="text-muted-foreground text-lg max-w-xs mx-auto font-medium">
                                    Start exploring jobs and save the ones you're interested in!
                                </p>
                            </div>
                            <Button asChild size="lg" className="rounded-2xl h-16 px-10 font-black text-lg shadow-xl shadow-primary/25">
                                <Link href="/jobs">
                                    Discover Opportunities
                                </Link>
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {savedJobs.map((job, index) => (
                                    <motion.div
                                        key={job?.id?.toString() || `job-${index}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative"
                                    >
                                        <div className="h-full bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col">
                                            {/* Top Actions */}
                                            <div className="flex justify-between items-start mb-6">
                                                <Badge variant="outline" className="px-4 py-2 rounded-full border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5">
                                                    {job.category}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => job?.id && removeJob(job.id.toString())}
                                                    className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <Link href={`/jobs/${job?.id || ''}`} className="block flex-1 group/title">
                                                <h3 className="text-2xl font-black tracking-tight leading-tight mb-4 group-hover/title:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                                {job.company && (
                                                    <div className="flex items-center gap-3 text-muted-foreground mb-6">
                                                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                                            <Building2 className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight">{job.company}</span>
                                                    </div>
                                                )}

                                                <div className="space-y-3 mb-8">
                                                    {job.location && (
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground/80 font-bold">
                                                            <MapPin className="h-4 w-4 text-primary/60" />
                                                            {job.location}
                                                        </div>
                                                    )}
                                                    {job.salary && (
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground/80 font-bold">
                                                            <DollarSign className="h-4 w-4 text-primary/60" />
                                                            {job.salary}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            <div className="pt-6 border-t border-border/10 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                                    <Clock className="h-3 w-3" />
                                                    {job.posted}
                                                </div>
                                                <Button asChild variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-[10px] group/btn">
                                                    <Link href={`/jobs/${job?.id || ''}`} className="flex items-center gap-1">
                                                        Details
                                                        <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-32 pt-20 border-t border-border/50"
                        >
                            <div className="flex flex-col gap-2 mb-12 text-center md:text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligent Discovery</p>
                                <h2 className="text-4xl font-black tracking-tight">Recommended <span className="text-primary italic">Opportunities</span></h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendations.map((job, index) => (
                                    <motion.div
                                        key={job?.id?.toString() || `recommendation-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card border border-border/50 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                <Building2 className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{job.title}</h4>
                                                {job.company && (
                                                    <p className="text-xs text-muted-foreground font-medium">{job.company}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-8 font-bold">
                                            {job.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                                    {job.location}
                                                </div>
                                            )}
                                            {job.salary && (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                                                    {job.salary}
                                                </div>
                                            )}
                                        </div>
                                        <Link href={`/jobs/${job?.id || ''}`}>
                                            <Button className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/10">
                                                View Position
                                                <ChevronRight className="h-3 w-3" />
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
