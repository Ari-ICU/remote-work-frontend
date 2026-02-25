"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    QrCode,
    X,
    Check,
    ShieldCheck,
    Loader2,
    Smartphone,
    Monitor,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/lib/api";

export function QrVerifier() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedToken, setScannedToken] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;
        let timeoutId: NodeJS.Timeout;

        if (isScannerOpen && !scannedToken) {
            // Add a small delay to ensure the Dialog has rendered the content
            timeoutId = setTimeout(() => {
                const element = document.getElementById("qr-reader");
                if (!element) return;

                scanner = new Html5QrcodeScanner(
                    "qr-reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
                );

                scanner.render(
                    (decodedText) => {
                        let token = decodedText;
                        if (decodedText.includes("token=")) {
                            token = decodedText.split("token=")[1].split("&")[0];
                        }

                        setScannedToken(token);
                        setIsScannerOpen(false);
                        if (scanner) scanner.clear();
                    },
                    (error) => {
                        // silent ignore scanning errors
                    }
                );
            }, 300);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (scanner) {
                scanner.clear().catch(console.error);
            }
        };
    }, [isScannerOpen, scannedToken]);

    const handleAction = async (approved: boolean) => {
        if (!approved) {
            try {
                await axios.post(`${API_URL}/auth/qr/reject`, { token: scannedToken });
            } catch (e) { }
            setScannedToken(null);
            return;
        }

        setStatus("verifying");
        try {
            await axios.post(`${API_URL}/auth/qr/verify`, { token: scannedToken }, { withCredentials: true });
            setStatus("success");
            toast.success("Login Approved!");

            setTimeout(() => {
                setScannedToken(null);
                setStatus("idle");
            }, 2000);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to verify session";
            toast.error(msg);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsScannerOpen(true)}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 rounded-xl bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-black transition-all group"
            >
                <QrCode size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Scan to Login</span>
            </Button>

            {/* Mobile icon version */}
            <Button
                onClick={() => setIsScannerOpen(true)}
                variant="ghost"
                size="icon"
                className="md:hidden text-primary"
            >
                <QrCode size={20} />
            </Button>

            {/* Scanner Dialog */}
            <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 rounded-[2rem] p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader className="items-center text-center">
                            <DialogTitle className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                                <Zap size={20} className="text-primary fill-primary" /> Active Scanner
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-xs">
                                Point your camera at a KhmerWork QR code
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="relative">
                        <div id="qr-reader" className="w-full border-y border-white/5 overflow-hidden" />
                        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
                            <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Processing Visual Data...
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Button
                            variant="ghost"
                            onClick={() => setIsScannerOpen(false)}
                            className="w-full rounded-xl text-gray-500 hover:text-white"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approval Dialog (Pop up) */}
            <Dialog open={!!scannedToken} onOpenChange={() => !status.includes("verifying") && setScannedToken(null)}>
                <DialogContent className="sm:max-w-[400px] bg-[#0d0d0d] border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-8"
                            >
                                <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Access Granted</h2>
                                    <p className="text-gray-400 text-sm mt-1">Verification sequence complete.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="approval"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black tracking-tight text-white">Login Request</h2>
                                        <p className="text-gray-500 text-xs">Identity confirmation required for device link.</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-3xl p-5 border border-white/5 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-primary shadow-inner">
                                            <Monitor size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Device</p>
                                            <p className="text-sm font-bold text-white">Browser Session</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-[0_5px_15px_rgba(var(--primary-rgb),0.3)]">
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platform</p>
                                            <p className="text-sm font-bold text-white">KhmerWork Enterprise</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => handleAction(false)}
                                        variant="outline"
                                        className="h-14 rounded-2xl font-bold border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                                        disabled={status === "verifying"}
                                    >
                                        <X size={18} className="mr-2" /> Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(true)}
                                        className="h-14 rounded-2xl font-black shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        disabled={status === "verifying"}
                                    >
                                        {status === "verifying" ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>Approve <Check size={20} className="ml-2" /></>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </>
    );
}
