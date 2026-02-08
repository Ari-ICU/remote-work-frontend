"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    Lock,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Sparkles,
    Shield,
    Check,
    Info,
    Calendar,
    User,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { fadeIn, scaleUp, staggerContainer } from "@/lib/animations";
import { authService } from "@/lib/services/auth";
import { jobsService } from "@/lib/services/jobs";
import api from "@/lib/api";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "featured";
    const amount = searchParams.get("amount") || "29";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "khqr">("card");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Card details state
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            router.push("/login?redirect=/checkout");
        }
    }, [router]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const getCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, "");
        if (cleaned.startsWith("4")) return "visa";
        if (cleaned.startsWith("5")) return "mastercard";
        if (cleaned.startsWith("3")) return "amex";
        return "card";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Get pending job data from sessionStorage
            const pendingJobData = sessionStorage.getItem("pendingJobData");
            if (!pendingJobData) {
                throw new Error("No pending job data found. Please start over.");
            }

            const jobData = JSON.parse(pendingJobData);

            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Create the job after successful payment
            await jobsService.create(jobData);

            // Clear session storage
            sessionStorage.removeItem("pendingJobData");
            sessionStorage.removeItem("selectedPlan");

            // Redirect to success page
            router.push("/post-job?success=true");
        } catch (err: any) {
            console.error("Payment failed:", err);
            setError(err.message || "Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const planFeatures = plan === "featured"
        ? ["2x visibility boost", "Priority support", "Featured badge", "30-day listing"]
        : ["Homepage spotlight", "Top of category", "60-day listing", "Account manager"];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
            <Header />

            <main className="flex-1 py-8 md:py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                    >
                        {/* Back Button */}
                        <Link
                            href="/post-job"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Job Posting
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Complete Your Purchase</h1>
                            <p className="text-muted-foreground">Secure checkout powered by industry-standard encryption</p>
                        </div>

                        <div className="grid gap-6 lg:gap-8 lg:grid-cols-5">
                            {/* Payment Form - Left Side (3 columns) */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Payment Method Selection */}
                                <motion.div
                                    className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
                                    variants={scaleUp}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
                                            <p className="text-sm text-muted-foreground">Choose your preferred payment option</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {[
                                            { id: "card", label: "Card", icon: CreditCard, desc: "Visa, Mastercard" },
                                            { id: "paypal", label: "PayPal", icon: Building2, desc: "Fast & secure" },
                                            { id: "khqr", label: "KHQR", icon: Sparkles, desc: "Local payment" }
                                        ].map((method) => (
                                            <motion.button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === method.id
                                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                                                    }`}
                                            >
                                                <method.icon className={`h-6 w-6 mb-2 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                                                <div className="text-sm font-bold mb-0.5">{method.label}</div>
                                                <div className="text-[10px] text-muted-foreground">{method.desc}</div>
                                                {paymentMethod === method.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-3"
                                        >
                                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <AnimatePresence mode="wait">
                                            {paymentMethod === "card" && (
                                                <motion.div
                                                    key="card-form"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-5"
                                                >
                                                    {/* Card Number */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cardNumber" className="text-sm font-semibold flex items-center gap-2">
                                                            Card Number
                                                            {cardNumber.length >= 16 && <Check className="h-3 w-3 text-green-500" />}
                                                        </Label>
                                                        <div className="relative group">
                                                            <CreditCard className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === "cardNumber" ? "text-primary" : "text-muted-foreground"}`} />
                                                            <Input
                                                                id="cardNumber"
                                                                value={cardNumber}
                                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                                onFocus={() => setFocusedField("cardNumber")}
                                                                onBlur={() => setFocusedField(null)}
                                                                placeholder="1234 5678 9012 3456"
                                                                maxLength={19}
                                                                required
                                                                className="pl-12 h-14 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary transition-all text-base"
                                                            />
                                                            {cardNumber.length > 0 && (
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase">
                                                                    {getCardType(cardNumber)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Cardholder Name */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cardName" className="text-sm font-semibold flex items-center gap-2">
                                                            Cardholder Name
                                                            {cardName.length >= 3 && <Check className="h-3 w-3 text-green-500" />}
                                                        </Label>
                                                        <div className="relative group">
                                                            <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === "cardName" ? "text-primary" : "text-muted-foreground"}`} />
                                                            <Input
                                                                id="cardName"
                                                                value={cardName}
                                                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                                                onFocus={() => setFocusedField("cardName")}
                                                                onBlur={() => setFocusedField(null)}
                                                                placeholder="JOHN DOE"
                                                                required
                                                                className="pl-12 h-14 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary transition-all text-base uppercase"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Expiry & CVV */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cardExpiry" className="text-sm font-semibold flex items-center gap-2">
                                                                Expiry Date
                                                                {cardExpiry.length === 5 && <Check className="h-3 w-3 text-green-500" />}
                                                            </Label>
                                                            <div className="relative group">
                                                                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === "cardExpiry" ? "text-primary" : "text-muted-foreground"}`} />
                                                                <Input
                                                                    id="cardExpiry"
                                                                    value={cardExpiry}
                                                                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                                    onFocus={() => setFocusedField("cardExpiry")}
                                                                    onBlur={() => setFocusedField(null)}
                                                                    placeholder="MM/YY"
                                                                    maxLength={5}
                                                                    required
                                                                    className="pl-12 h-14 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary transition-all text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cardCvv" className="text-sm font-semibold flex items-center gap-2">
                                                                CVV
                                                                <Info className="h-3 w-3 text-muted-foreground" />
                                                            </Label>
                                                            <div className="relative group">
                                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === "cardCvv" ? "text-primary" : "text-muted-foreground"}`} />
                                                                <Input
                                                                    id="cardCvv"
                                                                    type="password"
                                                                    value={cardCvv}
                                                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                                                    onFocus={() => setFocusedField("cardCvv")}
                                                                    onBlur={() => setFocusedField(null)}
                                                                    placeholder="•••"
                                                                    maxLength={4}
                                                                    required
                                                                    className="pl-12 h-14 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary transition-all text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {paymentMethod === "paypal" && (
                                                <motion.div
                                                    key="paypal-form"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="py-12 text-center"
                                                >
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                                        <Building2 className="h-10 w-10 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2">PayPal Checkout</h3>
                                                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                        You'll be securely redirected to PayPal to complete your payment
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                        <Shield className="h-4 w-4" />
                                                        <span>Protected by PayPal Buyer Protection</span>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {paymentMethod === "khqr" && (
                                                <motion.div
                                                    key="khqr-form"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="py-12 text-center"
                                                >
                                                    <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border shadow-inner">
                                                        <div className="text-center">
                                                            <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                                                            <span className="text-sm text-muted-foreground">QR Code will appear here</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2">Scan to Pay</h3>
                                                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                        Open your banking app and scan the QR code to complete payment
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                        <Shield className="h-4 w-4" />
                                                        <span>Secured by Bakong</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all mt-8"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span>Processing Payment...</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Lock className="h-5 w-5" />
                                                    Pay ${amount} USD
                                                </span>
                                            )}
                                        </Button>

                                        <p className="text-xs text-center text-muted-foreground pt-4">
                                            By confirming your payment, you agree to our{" "}
                                            <Link href="#" className="text-primary hover:underline font-medium">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="#" className="text-primary hover:underline font-medium">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                    </form>
                                </motion.div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-6 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">SSL Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Lock className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">PCI Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Verified Secure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary - Right Side (2 columns) */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 md:p-8 shadow-lg sticky top-24"
                                    variants={scaleUp}
                                >
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Order Summary
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Plan Details */}
                                        <div className="p-5 bg-primary/5 rounded-xl border border-primary/20">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="text-lg font-bold text-foreground capitalize">{plan} Plan</div>
                                                    <div className="text-sm text-muted-foreground mt-0.5">Job posting package</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-primary">${amount}</div>
                                                    <div className="text-xs text-muted-foreground">one-time</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-3 border-t border-primary/10">
                                                {planFeatures.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                                        <span className="text-muted-foreground">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-semibold">${amount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Processing fee</span>
                                                <span className="font-semibold">$0</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax</span>
                                                <span className="font-semibold">$0</span>
                                            </div>

                                            <div className="pt-3 border-t-2 border-border">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base font-bold">Total</span>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-primary">${amount}</div>
                                                        <div className="text-xs text-muted-foreground">USD</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Notice */}
                                        <div className="pt-4 border-t border-border">
                                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <div className="text-xs text-muted-foreground leading-relaxed">
                                                    Your payment information is encrypted and secure. We never store your card details.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
