"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Mail,
    Lock,
    User,
    Sparkles,
    Github,
    Chrome,
    BriefcaseBusiness,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeIn, scaleUp } from "@/lib/animations";
import { authService } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get("fullname") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Split name for backend
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || " ";

        try {
            await authService.register({
                email,
                password,
                firstName,
                lastName
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <div className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={scaleUp}
                        className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-border bg-card shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
                            <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome Aboard!</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Your talented profile has been created. Start discovering exclusive remote and freelance opportunities now.
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20" asChild>
                                <Link href="/">Go to Dashboard</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-background">
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                {/* Background Ornaments */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.08),transparent_50%)]" />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 12, repeat: Infinity }}
                        className="absolute -top-[5%] -right-[5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl"
                    />
                </div>

                <div className="w-full max-w-[480px] z-10">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={scaleUp}
                        className="rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Sparkles className="h-32 w-32 text-primary rotate-12" />
                        </div>

                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-5 shadow-xl shadow-primary/20">
                                <BriefcaseBusiness className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Create Free Profile
                            </h1>
                            <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">
                                Join Cambodia&apos;s best remote talent network and start working from anywhere.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="fullname"
                                        name="fullname"
                                        placeholder="John Doe"
                                        required
                                        className="pl-11 h-12 bg-background/50 rounded-xl border-border focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="pl-11 h-12 bg-background/50 rounded-xl border-border focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-11 h-12 bg-background/50 rounded-xl border-border focus-visible:ring-primary/20"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground px-1">Must be at least 8 characters with numbers.</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Get Started for Free"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card/40 backdrop-blur-none px-4 text-muted-foreground font-medium italic">Empowering your career</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-12 bg-background/50 border-border rounded-xl hover:bg-muted group/social"
                                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`}
                            >
                                <Chrome className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                Google
                            </Button>
                            <Button variant="outline" className="h-12 bg-background/50 border-border rounded-xl hover:bg-muted group/social">
                                <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                GitHub
                            </Button>
                        </div>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-primary hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>

                    <motion.p
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center text-xs text-muted-foreground leading-relaxed"
                    >
                        By creating an account, you agree to join our community and accept our{" "}
                        <Link href="#" className="underline hover:text-foreground">Terms</Link>{" "}
                        and{" "}
                        <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
