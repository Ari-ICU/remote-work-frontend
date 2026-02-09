"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { JobCategories } from "@/components/job-categories";
import { JobListings } from "@/components/job-listings";
import { StatsSection } from "@/components/stats-section";
import { FeaturedCompanies } from "@/components/featured-companies";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Job } from "@/types/job";
import { jobsService } from "@/lib/services/jobs";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await jobsService.getAll();
        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Unable to load latest jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.salary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location?.toLowerCase().includes(locationQuery.toLowerCase()) ?? true;
      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchQuery, locationQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setLocationQuery("");
  };

  const scrollToResults = () => {
    document.getElementById("find-jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection
          onSearch={(query, loc) => {
            setSearchQuery(query);
            setLocationQuery(loc);
            scrollToResults();
          }}
        />
        <JobCategories onSelectCategory={(category) => {
          setSearchQuery(category);
          scrollToResults();
        }} />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : (
          <JobListings
            jobs={filteredJobs}
            searchQuery={searchQuery}
            locationQuery={locationQuery}
            onReset={handleReset}
          />
        )}

        <StatsSection />
        <FeaturedCompanies />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
