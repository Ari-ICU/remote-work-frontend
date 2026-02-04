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
} from "lucide-react";
import { motion } from "framer-motion";
import { CategoryCard } from "./categories/category-card";
import { Category } from "@/types/job";
import { staggerContainer, fadeIn } from "@/lib/animations";

const categories: Category[] = [
  {
    name: "Development",
    count: 450,
    icon: Code,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Design",
    count: 280,
    icon: Palette,
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Marketing",
    count: 320,
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Customer Support",
    count: 190,
    icon: Headphones,
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Writing",
    count: 210,
    icon: PenTool,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Finance",
    count: 150,
    icon: DollarSign,
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Hourly Rate",
    count: 120,
    icon: Clock,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Translation",
    count: 120,
    icon: Globe,
    color: "bg-accent/10 text-accent",
  },
];

interface JobCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export function JobCategories({ onSelectCategory }: JobCategoriesProps) {
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
      </div>
    </section>
  );
}
