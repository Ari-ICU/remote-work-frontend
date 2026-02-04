"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section id="about" className="py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-12 shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
          >
            <div className="absolute top-0 right-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-8 text-3xl font-bold text-foreground">
                For Job Seekers
              </h3>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Create your profile, showcase your skills, and get discovered by
                top companies. We exclusively offer remote and freelance
                opportunities that allow you to work from anywhere.
              </p>
              <Link href="/register">
                <Button size="lg" className="mt-8 group/btn w-full sm:w-auto">
                  Create Free Profile
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 shadow-xl shadow-primary/20"
          >
            <div className="absolute top-0 right-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="mt-8 text-3xl font-bold text-white">
                For Employers
              </h3>
              <p className="mt-4 text-lg text-white/90 leading-relaxed">
                Post job listings and connect with Cambodia&apos;s top remote talent
                and freelance experts. Find the perfect flexible partner for your
                projects or long-term remote roles.
              </p>
              <Link href="/post-job">
                <Button variant="secondary" size="lg" className="mt-8 group/btn bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                  Post a Job
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
