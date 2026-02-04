"use client";

import { motion } from "framer-motion";
import { Category } from "@/types/job";
import { fadeIn } from "@/lib/animations";

interface CategoryCardProps {
    category: Category;
    onClick: (name: string) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
    const Icon = category.icon;

    return (
        <motion.button
            variants={fadeIn}
            whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(category.name)}
            type="button"
            className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 w-full relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/[0.03] group-hover:to-transparent transition-colors pointer-events-none" />
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20`}
            >
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-bold text-foreground group-hover:text-primary transition-colors text-center">
                {category.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
                {category.count} jobs
            </p>
        </motion.button>
    );
}
