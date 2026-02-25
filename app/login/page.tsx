"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff, Github, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeIn, scaleUp } from "@/lib/animations";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/components/providers/auth-provider";
import { API_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { QrLogin } from "@/components/auth/qr-login";
import { QrCode, Mail as MailIcon } from "lucide-react";

function LoginContent() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<"form" | "qr">("form");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await login({ email, password });
            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });
            router.push(redirect);
            router.refresh();
        } catch (err: any) {
            console.error("Login failed:", err);
            toast.error("Authentication failed", {
                description: err.response?.data?.message || "Invalid email or password. Please try again.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col bg-background">
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
                {/* Background Ornaments */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-3xl"
                    />
                </div>

                <div className="w-full max-w-[440px] z-10">
                    {/* Back Link */}
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
                            Back to homepage
                        </Link>
                    </motion.div>

                    {/* Login Card */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={scaleUp}
                        className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center mb-8">
                            <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4 shadow-lg shadow-primary/20">
                                <Briefcase className="h-6 w-6 text-primary-foreground" />
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {loginMethod === "form" ? "Welcome Back" : "Identity Verification"}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {loginMethod === "form" ? "Enter your credentials to access your account" : "Verify your identity using your smartphone"}
                            </p>
                        </div>

                        <div className="flex p-1 bg-muted/40 backdrop-blur-sm rounded-2xl mb-8 border border-white/5">
                            <button
                                onClick={() => setLoginMethod("form")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === "form"
                                    ? "bg-card text-primary shadow-[0_5px_15px_rgba(var(--primary-rgb),0.2)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                <MailIcon size={14} /> Password
                            </button>
                            <button
                                onClick={() => setLoginMethod("qr")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === "qr"
                                    ? "bg-card text-primary shadow-[0_5px_15px_rgba(var(--primary-rgb),0.2)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                <QrCode size={14} /> QR Code
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {loginMethod === "form" ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >


                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    required
                                                    className="pl-10 bg-background/50 border-border focus-visible:ring-primary/20 h-11"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <Link href="#" className="text-xs text-primary hover:underline">
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    required
                                                    className="pl-10 pr-10 bg-background/50 border-border focus-visible:ring-primary/20 h-11"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Signing in...
                                                </div>
                                            ) : (
                                                "Sign In"
                                            )}
                                        </Button>
                                    </form>

                                    <div className="relative my-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                </motion.div>
                            ) : (
                                <motion.div
                                    key="qr"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <QrLogin />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Create account
                            </Link>
                        </p>
                    </motion.div>

                    {/* Footer info */}
                    <motion.p
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-center text-xs text-muted-foreground"
                    >
                        By signing in, you agree to our{" "}
                        <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>
                    </motion.p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
