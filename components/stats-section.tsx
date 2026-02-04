"use client";

import { motion } from "framer-motion";
import { Stat } from "@/types/job";
import { fadeIn } from "@/lib/animations";

const stats: Stat[] = [
  { label: "Active Job Listings", value: "2,500+" },
  { label: "Companies Hiring", value: "500+" },
  { label: "Registered Freelancers", value: "15,000+" },
  { label: "Successful Placements", value: "8,200+" },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-primary py-12 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
