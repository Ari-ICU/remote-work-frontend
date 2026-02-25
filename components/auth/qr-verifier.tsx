"use client";

import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    QrCode,
    X,
    Check,
    ShieldCheck,
    Loader2,
    Monitor,
    Zap,
    Camera,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

export function QrVerifier() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedToken, setScannedToken] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (isScannerOpen && !scannedToken) {
            const startScanner = async () => {
                try {
                    html5QrCode = new Html5Qrcode("qr-reader");
                    setIsScanning(true);

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                        },
                        (decodedText) => {
                            let token = decodedText;
                            if (decodedText.includes("token=")) {
                                token = decodedText.split("token=")[1].split("&")[0];
                            }
                            setScannedToken(token);
                            setIsScannerOpen(false);
                            html5QrCode?.stop().catch(console.error);
                        },
                        (errorMessage) => {
                            // silent ignore scan errors
                        }
                    );
                    setHasPermission(true);
                } catch (err) {
                    console.error("Scanner error:", err);
                    setHasPermission(false);
                    setIsScanning(false);
                }
            };

            const timeoutId = setTimeout(startScanner, 300);
            return () => {
                clearTimeout(timeoutId);
                if (html5QrCode?.isScanning) {
                    html5QrCode.stop().catch(console.error);
                }
            };
        }
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
            <Dialog open={isScannerOpen} onOpenChange={(open) => {
                setIsScannerOpen(open);
                if (!open) {
                    setHasPermission(null);
                    setIsScanning(false);
                }
            }}>
                <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                    <div className="p-8 pb-4">
                        <DialogHeader className="items-center text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                                <Zap size={24} className="fill-primary" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white">
                                Active Scanner
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-xs font-medium">
                                Secure Identity Verification Sequence
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="relative aspect-square w-full max-w-[320px] mx-auto mt-4 px-4">
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group">
                            {/* Scanning Viewport */}
                            <div id="qr-reader" className="w-full h-full [&_video]:object-cover" />

                            {/* Custom Overlays */}
                            {isScanning && (
                                <>
                                    {/* Laser Line */}
                                    <motion.div
                                        initial={{ top: "10%" }}
                                        animate={{ top: "90%" }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "linear"
                                        }}
                                        className="absolute left-[10%] right-[10%] h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] z-10"
                                    />

                                    {/* Corner Accents */}
                                    <div className="absolute inset-[10%] pointer-events-none">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl" />
                                    </div>
                                </>
                            )}

                            {/* Permission State */}
                            {hasPermission === false && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-sm text-center space-y-4">
                                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                                        <Camera size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">Camera Access Denied</p>
                                        <p className="text-xs text-gray-400">Please enable camera permissions in your browser settings to continue.</p>
                                    </div>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-white/10 hover:bg-white/5"
                                    >
                                        <RefreshCw size={14} className="mr-2" /> Retry Sequence
                                    </Button>
                                </div>
                            )}

                            {/* Loading State */}
                            {hasPermission === null && !isScanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">Initializing Lens...</p>
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", isScanning ? "bg-primary animate-pulse" : "bg-gray-500")} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    {isScanning ? "Data Stream Active" : "Waiting for Input"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-10">
                        <Button
                            variant="ghost"
                            onClick={() => setIsScannerOpen(false)}
                            className="w-full h-12 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors font-bold"
                        >
                            Cancel Operation
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
