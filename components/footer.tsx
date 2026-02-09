"use client";

import Link from "next/link";
import { Briefcase, Facebook, Twitter, Linkedin, Instagram, Mail, Send } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  forJobSeekers: [
    { label: "Browse Jobs", href: "/#find-jobs" },
    { label: "Categories", href: "/#categories" },
    { label: "Companies", href: "/#companies" },
    { label: "Salary Guide", href: "/salary-guide" },
  ],
  forEmployers: [
    { label: "Post a Job", href: "/post-job" },
    { label: "Pricing", href: "/pricing" },
    { label: "Hiring Solutions", href: "/hiring-solutions" },
    { label: "Employer Resources", href: "/employer-resources" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/khmerwork",
    icon: Facebook,
    color: "hover:text-[#1877F2]"
  },
  {
    label: "Twitter",
    href: "https://twitter.com/khmerwork",
    icon: Twitter,
    color: "hover:text-[#1DA1F2]"
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/khmerwork",
    icon: Linkedin,
    color: "hover:text-[#0A66C2]"
  },
  {
    label: "Instagram",
    href: "https://instagram.com/khmerwork",
    icon: Instagram,
    color: "hover:text-[#E4405F]"
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription API
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          {/* Brand & Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-transform group-hover:rotate-6 group-hover:scale-110">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                KhmerWork
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Cambodia&apos;s exclusive marketplace for 100% remote and
              freelance job opportunities. Building the future of flexible work.
            </p>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:scale-110 hover:bg-muted/80 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Subscribe to Our Newsletter
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest job opportunities and career tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {subscribed ? (
                  <>
                    <span className="text-sm">✓ Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KhmerWork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
