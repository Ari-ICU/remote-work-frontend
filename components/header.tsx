"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, User, LogOut, ShieldCheck, MessageSquare, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";
import { SettingsControl } from "@/components/settings-control";
import { messagingService } from "@/lib/services/messaging";
import { wishlistService } from "@/lib/services/wishlist";

export function Header() {
  const t = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Check for user on mount
    setUser(authService.getCurrentUser());

    // Initialize saved jobs count
    setSavedJobsCount(wishlistService.getSavedJobIds().length);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const count = await messagingService.getUnreadCount();
          setUnreadCount(count);
        } catch (err) {
          console.error("Failed to fetch unread count", err);
        }
      };
      fetchUnread();

      // Poll every 10 seconds for updates when not on messages page
      const interval = setInterval(fetchUnread, 10000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user]);

  // Track saved jobs count changes
  useEffect(() => {
    const updateSavedCount = () => {
      setSavedJobsCount(wishlistService.getSavedJobIds().length);
    };

    // Listen for storage changes (cross-tab sync)
    window.addEventListener("storage", updateSavedCount);

    // Custom event for same-tab updates
    window.addEventListener("wishlistUpdated", updateSavedCount);

    return () => {
      window.removeEventListener("storage", updateSavedCount);
      window.removeEventListener("wishlistUpdated", updateSavedCount);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push("/");
  };

  const getAvatarUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${baseUrl}${path}`;
  };

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
          {["home", "jobs", "categories", "companies", "about"].map((item) => (
            <Link
              key={item}
              href={item === "home" ? "/" : `/#${item}`}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group capitalize"
            >
              {t(item)}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SettingsControl />
          <div className="w-px h-6 bg-border mx-1" />
          {user ? (
            <>
              {user.role?.toUpperCase() === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {t("dashboard")}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="group rounded-xl relative" title="Dashboard">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </Link>
              <Link href="/jobs/saved">
                <Button variant="ghost" size="icon" className="group rounded-xl relative" title="Saved Jobs">
                  <Bookmark className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  {savedJobsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground ring-2 ring-background animate-in zoom-in duration-300">
                      {savedJobsCount > 9 ? "9+" : savedJobsCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="group rounded-xl relative" title="Messages">
                  <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background animate-in zoom-in duration-300">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 rounded-xl h-10 px-3">
                  <div className="h-6 w-6 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border">
                    {user.avatar ? (
                      <img src={getAvatarUrl(user.avatar) || ''} alt={user.firstName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium">{user.firstName}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="rounded-xl">
                <LogOut className="h-4 w-4" />
              </Button>
              <Link href="/post-job">
                <Button size="sm" className="shadow-md hover:shadow-lg transition-shadow">
                  Post a Job
                </Button>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
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
              {["home", "jobs", "categories", "companies", "about"].map((item) => (
                <Link
                  key={item}
                  href={item === "home" ? "/" : `/#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground capitalize"
                >
                  {t(item)}
                </Link>
              ))}

              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t("theme")} / {t("language")}</span>
                <SettingsControl />
              </div>

              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    {user.role?.toUpperCase() === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="justify-start w-full gap-2 border-primary/20 bg-primary/5">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          {t("dashboard")}
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/jobs/saved" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full gap-2 relative">
                        <Bookmark className="h-4 w-4" />
                        Saved Jobs
                        {savedJobsCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full">
                            {savedJobsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full gap-2 relative">
                        <MessageSquare className="h-4 w-4" />
                        Messages
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" className="justify-start w-full gap-2 text-destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                    <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="justify-start w-full">Post a Job</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="justify-start w-full">Post a Job</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
