"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Smartphone, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function QrLogin() {
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "pending" | "verified" | "expired">("loading");
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const router = useRouter();

    const fetchQr = async () => {
        setStatus("loading");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/qr/generate`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            if (!data.token) throw new Error("No token received from server");

            setQrToken(data.token);

            // Generate Approval URL
            const approveUrl = `${window.location.origin}/auth/qr/approve?token=${data.token}`;

            // Generate QR Code Data URL
            const url = await QRCode.toDataURL(approveUrl, {
                width: 320,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
            setQrDataUrl(url);
            setStatus("pending");
        } catch (error) {
            console.error("Failed to fetch QR", error);
            setStatus("expired"); // Show retry state
            toast.error("Failed to generate login code");
        }
    };

    useEffect(() => {
        fetchQr();
    }, []);

    useEffect(() => {
        if (status !== "pending" || !qrToken) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/qr/status?token=${qrToken}`);
                const data = await res.json();

                if (data.status === "verified") {
                    setStatus("verified");
                    clearInterval(interval);
                    toast.success("Login successful!", {
                        description: "Identity verified via mobile device."
                    });

                    setTimeout(() => {
                        router.push("/");
                        router.refresh();
                    }, 1500);
                } else if (data.status === "expired") {
                    setStatus("expired");
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [qrToken, status, router]);

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <AnimatePresence mode="wait">
                {status === "loading" ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[200px] w-[200px] flex items-center justify-center bg-muted/20 rounded-2xl border-2 border-dashed border-border"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </motion.div>
                ) : status === "expired" ? (
                    <motion.div
                        key="expired"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[200px] w-[200px] flex flex-col items-center justify-center bg-rose-500/5 rounded-2xl border-2 border-rose-500/20 space-y-3 cursor-pointer group"
                        onClick={fetchQr}
                    >
                        <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20 transition-colors">
                            <Clock className="h-8 w-8" />
                        </div>
                        <p className="text-xs font-bold text-rose-500 uppercase tracking-tighter">Code Expired</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                            <RefreshCw className="h-3 w-3" /> Tap to refresh
                        </p>
                    </motion.div>
                ) : status === "verified" ? (
                    <motion.div
                        key="verified"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[200px] w-[200px] flex flex-col items-center justify-center bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20 space-y-3"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="p-3 rounded-full bg-emerald-500/20 text-emerald-500"
                        >
                            <CheckCircle2 className="h-10 w-10" />
                        </motion.div>
                        <p className="text-sm font-black text-emerald-500 uppercase">Authenticated</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="qr"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative p-4 bg-white rounded-2xl border-2 border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        {qrDataUrl && (
                            <img
                                src={qrDataUrl}
                                alt="Login QR Code"
                                className="w-[160px] h-[160px] rounded-lg"
                            />
                        )}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-lg border border-primary/10">
                            <Smartphone className="h-5 w-5 text-primary" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center space-y-4 max-w-[280px]">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Gateway</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">Login with Phone</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Open your <strong>KhmerWork App</strong>, tap the QR scanner, and point it at the screen to login instantly.
                </p>
            </div>

            {status === "pending" && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchQr}
                    className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Regenerate Code
                </Button>
            )}
        </div>
    );
}
