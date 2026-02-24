"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const t = useTranslations("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useAuth();

  const handleSearch = () => {
    onSearch?.(searchQuery, location);
  };

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
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
            opacity: [0.2, 0.3, 0.2],
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
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-8"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t("welcomeBack", { name: user.firstName })}
            </motion.div>
          )}
          <h1 className="text-pretty text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-8xl">
            {t("title1")} <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-primary">{t("title2")}</span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-4 bg-primary/10 -z-5"
              />
            </span>
            <br />{t("title3")}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-2xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div className="relative p-1.5 bg-gradient-to-r from-primary/20 via-border to-primary/20 rounded-[2.5rem] shadow-2xl">
            <div className="flex flex-col gap-3 rounded-[2.25rem] bg-card border border-white/10 p-4 shadow-inner sm:flex-row sm:items-center sm:gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent pl-12 shadow-none focus-visible:ring-0 text-lg h-14 font-medium"
                />
              </div>
              <div className="hidden h-10 w-px bg-border sm:block" />
              <div className="relative flex-1 group">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder={t("locationPlaceholder")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 bg-transparent pl-12 shadow-none focus-visible:ring-0 text-lg h-14 font-medium"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95"
                  onClick={handleSearch}
                >
                  {t("searchButton")}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("trending")}</span>
            {["React", "Fullstack", "Design", "Mobile"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 rounded-full bg-muted/50 text-[11px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
              >
                {t(tag.toLowerCase())}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl"
        >
          <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-secondary/30 border border-border/50 group hover:border-primary/20 transition-colors">
            <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">2.5k+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("verifiedJobs")}</div>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-secondary/30 border border-border/50 group hover:border-primary/20 transition-colors">
            <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">500+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("curatedCompanies")}</div>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-secondary/30 border border-border/50 group hover:border-primary/20 transition-colors">
            <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">100%</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("freeForSeekers")}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
