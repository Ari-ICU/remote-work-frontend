"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { JobListings } from "@/components/job-listings";
import { Footer } from "@/components/footer";
import { jobs } from "@/lib/data";
import { Job } from "@/types/job";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const JOB_TYPE_FILTERS = [
    { label: "Remote", value: "remote" },
    { label: "Freelance", value: "freelance" },
    { label: "Part-time", value: "part-time" },
    { label: "Full-time", value: "full-time" },
    { label: "Hourly", value: "hourly" }
];

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredJobs = useMemo(() => {
        return (jobs as Job[]).filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.salary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());

            // Job type filtering
            let matchesType = true;
            if (selectedTypes.length > 0) {
                const jobTypeLower = job.type.toLowerCase();
                matchesType = selectedTypes.some(type => {
                    if (type === "remote") return jobTypeLower.includes("remote");
                    if (type === "freelance") return jobTypeLower.includes("freelance");
                    if (type === "part-time") return jobTypeLower.includes("part-time");
                    if (type === "full-time") return jobTypeLower.includes("full-time");
                    if (type === "hourly") return job.salary.toLowerCase().includes("/hr");
                    return false;
                });
            }

            return matchesSearch && matchesLocation && matchesType;
        });
    }, [searchQuery, locationQuery, selectedTypes]);

    const handleReset = () => {
        setSearchQuery("");
        setLocationQuery("");
        setSelectedTypes([]);
    };

    const toggleTypeFilter = (value: string) => {
        setSelectedTypes(prev =>
            prev.includes(value)
                ? prev.filter(t => t !== value)
                : [...prev, value]
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6"
                        >
                            All Jobs
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <div className="p-4 bg-card border border-border rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, company, or keywords..."
                                        className="pl-10 h-12 rounded-xl"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Location..."
                                        className="pl-10 h-12 rounded-xl"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 rounded-xl px-6"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                    {selectedTypes.length > 0 && (
                                        <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                            {selectedTypes.length}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-6 bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl shadow-lg backdrop-blur-sm"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Filter className="h-4 w-4 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-base">Filter by Job Type</h3>
                                        </div>
                                        {selectedTypes.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedTypes([])}
                                                className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Clear all
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {JOB_TYPE_FILTERS.map((filter) => {
                                            const isSelected = selectedTypes.includes(filter.value);
                                            return (
                                                <motion.button
                                                    key={filter.value}
                                                    onClick={() => toggleTypeFilter(filter.value)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${isSelected
                                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                                            : "bg-background/50 text-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>{filter.label}</span>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center"
                                                            >
                                                                <X className="h-2.5 w-2.5" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {selectedTypes.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl"
                                >
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        <span>Active filters:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTypes.map((type) => (
                                            <Badge
                                                key={type}
                                                variant="secondary"
                                                className="capitalize bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                                            >
                                                {JOB_TYPE_FILTERS.find(f => f.value === type)?.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    <JobListings
                        jobs={filteredJobs}
                        searchQuery={searchQuery}
                        locationQuery={locationQuery}
                        onReset={handleReset}
                        hideViewAll={true}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
