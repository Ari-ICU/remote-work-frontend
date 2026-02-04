"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "border-b border-border bg-background/80 backdrop-blur-md"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
            >
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">KhmerWork</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {["Find Jobs", "Categories", "Companies", "About"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase().replace(" ", "-")}`}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/post-job">
            <Button size="sm" className="shadow-md hover:shadow-lg transition-shadow">
              Post a Job
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-2 px-4 py-4">
              {["Find Jobs", "Categories", "Companies", "About"].map((item) => (
                <Link
                  key={item}
                  href={`/#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="justify-start w-full">Post a Job</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
