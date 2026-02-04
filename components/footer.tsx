import Link from "next/link";
import { Briefcase } from "lucide-react";

const footerLinks = {
  forJobSeekers: [
    { label: "Browse Jobs", href: "/#find-jobs" },
    { label: "Categories", href: "/#categories" },
    { label: "Companies", href: "/#companies" },
    { label: "Salary Guide", href: "/coming-soon?feature=Salary Guide" },
  ],
  forEmployers: [
    { label: "Post a Job", href: "/post-job" },
    { label: "Pricing", href: "/pricing" },
    { label: "Hiring Solutions", href: "/coming-soon?feature=Hiring Solutions" },
    { label: "Employer Resources", href: "/coming-soon?feature=Employer Resources" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/coming-soon?feature=Blog" },
    { label: "Press", href: "/coming-soon?feature=Press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/coming-soon?feature=Privacy Policy" },
    { label: "Terms of Service", href: "/coming-soon?feature=Terms of Service" },
    { label: "Cookie Policy", href: "/coming-soon?feature=Cookie Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KhmerWork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
