"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Clock, DollarSign, Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { scaleUp } from "@/lib/animations";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface JobCardProps {
    job: Job;
    isSaved: boolean;
    onToggleSave: (id: number) => void;
}

export function JobCard({ job, isSaved, onToggleSave }: JobCardProps) {
    return (
        <motion.article
            variants={scaleUp}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 },
            }}
            className={`group relative rounded-2xl border bg-card p-6 transition-all hover:shadow-xl ${job.featured
                ? "border-primary/40 ring-1 ring-primary/10"
                : "border-border hover:border-primary/30"
                }`}
        >
            {job.featured && (
                <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground shadow-sm">
                    Featured
                </Badge>
            )}

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                        <Building2 className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {job.company}
                        </p>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    type="button"
                    onClick={() => onToggleSave(job.id)}
                    className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-primary"
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                    <Bookmark
                        className={`h-5 w-5 ${isSaved
                            ? "fill-primary text-primary"
                            : ""
                            }`}
                    />
                </motion.button>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{job.type}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-bold">{job.salary}</span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                    Posted {job.posted}
                </span>
                <Link href={`/apply/${job.id}/${slugify(job.title)}`} className="group/apply flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                    Apply Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/apply:translate-x-1" />
                </Link>
            </div>
        </motion.article>
    );
}
