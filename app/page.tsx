"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { JobCategories } from "@/components/job-categories";
import { JobListings } from "@/components/job-listings";
import { StatsSection } from "@/components/stats-section";
import { FeaturedCompanies } from "@/components/featured-companies";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { jobs } from "@/lib/data";
import { Job } from "@/types/job";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const filteredJobs = useMemo(() => {
    return (jobs as Job[]).filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.salary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, locationQuery]);

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
        <JobListings
          jobs={filteredJobs}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          onReset={handleReset}
        />
        <StatsSection />
        <FeaturedCompanies />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
