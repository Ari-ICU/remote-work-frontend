"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { JobCard } from "./jobs/job-card";
import { Job } from "@/types/job";
import { staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";
import { wishlistService } from "@/lib/services/wishlist";
import { toast } from "sonner";

interface JobListingsProps {
  jobs: Job[];
  searchQuery?: string;
  locationQuery?: string;
  filterCount?: number;
  onReset?: () => void;
  hideViewAll?: boolean;
}

export function JobListings({ jobs, searchQuery, locationQuery, filterCount = 0, onReset, hideViewAll = false }: JobListingsProps) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    // Initial load of saved jobs
    const updateSavedJobs = () => {
      setSavedJobs(wishlistService.getSavedJobIds());
    };

    updateSavedJobs();

    // Listen for storage and custom events
    window.addEventListener("storage", updateSavedJobs);
    window.addEventListener("wishlistUpdated", updateSavedJobs);

    return () => {
      window.removeEventListener("storage", updateSavedJobs);
      window.removeEventListener("wishlistUpdated", updateSavedJobs);
    };
  }, []);

  const toggleSaveJob = (jobId: string) => {
    const isNowSaved = wishlistService.toggleJob(jobId);
    setSavedJobs(wishlistService.getSavedJobIds());

    if (isNowSaved) {
      toast.success("Saved to your wishlist!");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery, filterCount]);

  const isSearching = searchQuery || locationQuery || filterCount > 0;
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("find-jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="find-jobs" className="py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={slideInLeft}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isSearching ? (
                <span>
                  Search <span className="text-primary italic">Results</span>
                </span>
              ) : (
                "Latest Job Opportunities"
              )}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
              {isSearching ? (
                <>
                  <span>Showing {jobs.length} results for </span>
                  {searchQuery && (
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      "{searchQuery}"
                    </span>
                  )}
                  {locationQuery && (
                    <>
                      <span>in</span>
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        "{locationQuery}"
                      </span>
                    </>
                  )}
                </>
              ) : (
                <p>Discover the newest remote and freelance positions</p>
              )}
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={slideInRight}
          >
            {!hideViewAll && (
              <Link href="/jobs">
                <Button
                  variant="outline"
                  className="shrink-0 bg-transparent group"
                >
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          className="mt-10 grid gap-6 lg:grid-cols-2 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <JobCard
                    job={job}
                    isSaved={savedJobs.includes(String(job.id))}
                    onToggleSave={(id) => toggleSaveJob(id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No jobs found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or location to find more opportunities.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={onReset}
                >
                  Reset Search
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 p-2 shadow-lg backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-1 px-2 border-x border-border/50">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 rounded-full font-bold transition-all ${currentPage === page
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
