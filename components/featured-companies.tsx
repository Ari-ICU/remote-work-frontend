"use client";

import { Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { jobsService } from "@/lib/services/jobs";

interface Company {
  id?: string;
  name: string;
  jobsCount: number;
  logo: string;
  avatar?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await jobsService.getFeaturedCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch featured companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const getAvatarUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${baseUrl}${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (companies.length === 0) {
    return null;
  }

  return (
    <section id="companies" className="bg-muted/30 py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Featured Companies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Top employers in Cambodia actively looking for talented professionals
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {companies.map((company, index) => (
            <motion.button
              key={company.id || `${company.name}-${index}`}
              variants={item}
              whileHover={{ y: -5 }}
              type="button"
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                {company.avatar ? (
                  <img src={getAvatarUrl(company.avatar) || ''} alt={company.name} className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                )}
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-[10px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100 uppercase">
                  {company.logo}
                </div>
              </div>
              <h3 className="mt-4 text-center text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {company.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {company.jobsCount} open positions
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
