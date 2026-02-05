"use client";

import {
  Code,
  Palette,
  TrendingUp,
  Headphones,
  PenTool,
  DollarSign,
  Clock,
  Globe,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { CategoryCard } from "./categories/category-card";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { useState, useEffect } from "react";
import { jobsService } from "@/lib/services/jobs";

const iconMap: Record<string, any> = {
  "Software Engineering": Code,
  "Development": Code,
  "Programming": Code,
  "Creative & Design": Palette,
  "Design": Palette,
  "UI/UX": Palette,
  "Marketing": TrendingUp,
  "Sales": TrendingUp,
  "Customer Support": Headphones,
  "Support": Headphones,
  "Writing": PenTool,
  "Content": PenTool,
  "Finance": DollarSign,
  "Accounting": DollarSign,
  "Management": Clock,
  "Translation": Globe,
};

const colorMap = [
  "bg-primary/10 text-primary",
  "bg-accent/10 text-accent",
  "bg-blue-500/10 text-blue-500",
  "bg-purple-500/10 text-purple-500",
  "bg-green-500/10 text-green-500",
  "bg-orange-500/10 text-orange-500",
];

interface JobCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export function JobCategories({ onSelectCategory }: JobCategoriesProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await jobsService.getCategories();
        if (!Array.isArray(data)) {
          console.error("Categories data is not an array:", data);
          setCategories([]);
          return;
        }
        const mappedCategories = data.map((cat: any, index: number) => ({
          name: cat.name,
          count: cat.count,
          icon: iconMap[cat.name] || Globe,
          color: colorMap[index % colorMap.length],
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section id="categories" className="bg-muted/30 py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Browse by Category
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Explore job opportunities across various industries and find the
            perfect match for your skills
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                onClick={(name) => onSelectCategory?.(name)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
