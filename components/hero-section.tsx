"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useAuth();

  const handleSearch = () => {
    onSearch?.(searchQuery, location);
  };

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Welcome back, {user.firstName}!
            </motion.div>
          )}
          <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Cambodia&apos;s Exclusive
            <span className="block text-primary">Remote & Freelance</span>
            Job Marketplace
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The only platform in Cambodia dedicated 100% to remote roles and
            freelance opportunities. Connect with top local and international
            companies from anywhere.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 shadow-xl sm:flex-row sm:items-center sm:gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0 text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="relative flex-1 group">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Location (e.g., Phnom Penh)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0 text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 transition-transform hover:scale-105 active:scale-95"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              {user && (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 transition-transform hover:scale-105 active:scale-95 border-primary text-primary hover:bg-primary/5"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground md:gap-x-12"
        >
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <div className="rounded-full bg-primary/10 p-1">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">2,500+ Active Jobs</span>
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-medium">500+ Companies Hiring</span>
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-medium">100% Free for Job Seekers</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
