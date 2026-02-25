"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Monitor, Smartphone, Check, X, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import axios from "axios";

function ApproveContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">("pending");
    const [error, setError] = useState<string | null>(null);

    const handleAction = async (approved: boolean) => {
        if (!approved) {
            try {
                await axios.post(`${API_URL}/auth/qr/reject`, { token });
            } catch (e) {
                console.error("Failed to reject", e);
            }
            router.push("/");
            return;
        }

        setStatus("verifying");
        try {
            await axios.post(`${API_URL}/auth/qr/verify`, { token }, { withCredentials: true });
            setStatus("success");
            toast.success("Login request approved!");

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to verify session";
            setError(msg);
            setStatus("error");
            toast.error(msg);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4">
                    <X size={40} />
                </div>
                <h1 className="text-xl font-bold">Invalid Request</h1>
                <p className="text-muted-foreground mt-2">No session token was provided.</p>
                <Button variant="outline" className="mt-6" onClick={() => router.push("/")}>Return Home</Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="relative mx-auto w-24 h-24">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                            >
                                <Check size={48} />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-emerald-500 rounded-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-foreground">Access Granted</h1>
                            <p className="text-muted-foreground mt-2">The browser session has been successfully authenticated.</p>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Redirecting you...</p>
                    </motion.div>
                ) : status === "error" ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                            <X size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
                            <p className="text-muted-foreground mt-2">{error || "This login request is no longer valid or has expired."}</p>
                        </div>
                        <Button variant="secondary" className="w-full h-12 rounded-2xl font-bold" onClick={() => router.push("/")}>
                            Back to Home
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="request"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-2">
                                <ShieldCheck size={32} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Login Approval</h1>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                A web browser is requesting access to your account via QR code scan.
                            </p>
                        </div>

                        <div className="bg-muted/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Lock size={80} />
                            </div>

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="flex -space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center text-primary shadow-xl">
                                        <Smartphone size={24} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl relative z-10 translate-y-2">
                                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
                                        <Check size={28} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-background border-2 border-border flex items-center justify-center text-muted-foreground shadow-xl translate-y-4 opacity-50">
                                        <Monitor size={24} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-primary uppercase tracking-tighter">New Request</p>
                                    <p className="text-sm font-bold mt-1">KhmerWork Web</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Phnom Penh, Cambodia • Just now</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-14 rounded-2xl font-bold border-2 hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/20 transition-all group"
                                onClick={() => handleAction(false)}
                                disabled={status === "verifying"}
                            >
                                <X size={18} className="mr-2 group-hover:scale-125 transition-transform" /> Reject
                            </Button>
                            <Button
                                className="h-14 rounded-2xl font-black shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={() => handleAction(true)}
                                disabled={status === "verifying"}
                            >
                                {status === "verifying" ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>Approve <Check size={20} className="ml-2" /></>
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-4">
                            <Lock size={12} /> End-to-end Encrypted
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ApprovePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary h-12 w-12" />
            </div>
        }>
            <ApproveContent />
        </Suspense>
    );
}
